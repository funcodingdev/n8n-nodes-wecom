#!/usr/bin/env bash
# =============================================================================
# 一键部署 / 本地联调 n8n 社区节点
#
# 对齐官方文档:
#   https://docs.n8n.io/connect/create-nodes/test-your-node/run-your-node-locally
#
# 官方步骤摘要:
#   1. npm install n8n -g
#   2. 节点目录: npm run build && npm link
#   3. 在 ~/.n8n/custom 中: npm link <package-name>
#      - Windows: C:\Users\<username>\.n8n\custom
#      - Linux:   /home/<username>/.n8n/custom
#      - macOS:   /Users/<username>/.n8n/custom
#      - 若设置了 N8N_CUSTOM_EXTENSIONS，使用该目录
#   4. 若 custom 不存在: mkdir + npm init
#   5. 启动 n8n，在节点面板中搜索你的节点
#
# 用法:
#   ./scripts/deploy-community-node.sh              # 官方本地 link（结束询问 y/n 是否启动 n8n）
#   ./scripts/deploy-community-node.sh --start       # 部署后直接启动（跳过询问）
#   ./scripts/deploy-community-node.sh --no-start    # 部署后不启动（跳过询问）
#   ./scripts/deploy-community-node.sh --install-n8n # 顺带全局安装 n8n
#   ./scripts/deploy-community-node.sh --from-npm    # 从 npm 装到 ~/.n8n/nodes
#   ./scripts/deploy-community-node.sh --docker      # 部署到 Docker（结束询问是否重启容器）
#   ./scripts/deploy-community-node.sh --help
# =============================================================================

set -euo pipefail

# ---------- colors ----------
if [[ -t 1 ]]; then
	C_RESET=$'\033[0m'
	C_BOLD=$'\033[1m'
	C_DIM=$'\033[2m'
	C_RED=$'\033[31m'
	C_GREEN=$'\033[32m'
	C_YELLOW=$'\033[33m'
	C_BLUE=$'\033[34m'
	C_CYAN=$'\033[36m'
else
	C_RESET= C_BOLD= C_DIM= C_RED= C_GREEN= C_YELLOW= C_BLUE= C_CYAN=
fi

info()  { printf '%s==>%s %s\n' "${C_BLUE}${C_BOLD}" "${C_RESET}" "$*"; }
ok()    { printf '%s✓%s %s\n' "${C_GREEN}${C_BOLD}" "${C_RESET}" "$*"; }
warn()  { printf '%s!%s %s\n' "${C_YELLOW}${C_BOLD}" "${C_RESET}" "$*"; }
err()   { printf '%s✗%s %s\n' "${C_RED}${C_BOLD}" "${C_RESET}" "$*" >&2; }
die()   { err "$*"; exit 1; }

# ---------- defaults ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# n8n resolves data dir as:  $N8N_USER_FOLDER/.n8n
# Official default: N8N_USER_FOLDER=$HOME  →  ~/.n8n  (and custom at ~/.n8n/custom)
# IMPORTANT: do NOT set N8N_USER_FOLDER=~/.n8n or n8n will use ~/.n8n/.n8n and miss custom nodes.
N8N_USER_FOLDER="${N8N_USER_FOLDER:-${HOME}}"
N8N_DATA_DIR="${N8N_USER_FOLDER}/.n8n"
if [[ -n "${N8N_CUSTOM_EXTENSIONS:-}" ]]; then
	# N8N_CUSTOM_EXTENSIONS may be a single path or ;-separated list; use first for linking
	CUSTOM_DIR="${N8N_CUSTOM_EXTENSIONS%%;*}"
else
	CUSTOM_DIR="${N8N_DATA_DIR}/custom"
fi

N8N_DOCKER_NAME="${N8N_DOCKER_NAME:-n8n}"
NODE22_BIN="${NODE22_BIN:-/opt/homebrew/opt/node@22/bin}"
SKIP_BUILD="${SKIP_BUILD:-0}"
PACKAGE_VERSION="latest"

# Modes: link (official default) | npm | docker
MODE="link"
INSTALL_N8N=0
# START_N8N: "" = ask y/n (default), "1" = yes, "0" = no
START_N8N=""

usage() {
	cat <<'EOF'
一键部署 n8n 社区节点（对齐官方 Run your node locally）

官方文档:
  https://docs.n8n.io/connect/create-nodes/test-your-node/run-your-node-locally

默认流程（官方）:
  1) npm run build
  2) npm link                          # 在节点项目目录
  3) npm link <package-name>           # 在 ~/.n8n/custom
  4) 交互确认是否启动 n8n (y/n)

用法:
  ./scripts/deploy-community-node.sh [选项]

选项:
  --link               官方本地 link 流程（默认）
  --start              部署完成后直接启动 n8n（跳过 y/n）
  --no-start           部署完成后不启动 n8n（跳过 y/n）
  --install-n8n        若本机无 n8n，执行 npm install n8n -g
  --from-npm [ver]     从 npm 安装到 ~/.n8n/nodes（社区节点安装路径）
  --docker             将本机构建产物安装进 Docker 中的 n8n
  --user-folder DIR    n8n 的 N8N_USER_FOLDER（默认: \$HOME；数据在 \$DIR/.n8n）
  --custom-dir DIR     自定义节点目录（默认: ~/.n8n/custom，或 N8N_CUSTOM_EXTENSIONS）
  --docker-name NAME   Docker 容器名（默认: n8n）
  --skip-build         跳过 npm run build
  -h, --help           显示帮助

环境变量:
  N8N_USER_FOLDER        默认 \$HOME（n8n 会使用 \$N8N_USER_FOLDER/.n8n）
  N8N_CUSTOM_EXTENSIONS  额外自定义扩展目录（; 分隔）
  N8N_DOCKER_NAME        Docker 容器名
  NODE_PACKAGE           覆盖 package.json 中的包名
  NODE22_BIN             Node 22 路径（默认 /opt/homebrew/opt/node@22/bin）

示例:
  # 官方推荐：本地构建并 link，结束后询问是否启动
  ./scripts/deploy-community-node.sh

  # 跳过询问，直接启动
  ./scripts/deploy-community-node.sh --install-n8n --start

  # 安装 npm 已发布版本
  ./scripts/deploy-community-node.sh --from-npm
  ./scripts/deploy-community-node.sh --from-npm 0.4.10

  # Docker（结束后询问是否重启容器）
  N8N_DOCKER_NAME=my-n8n ./scripts/deploy-community-node.sh --docker
EOF
}

# ---------- parse args ----------
while [[ $# -gt 0 ]]; do
	case "$1" in
		--link) MODE="link"; shift ;;
		--from-npm)
			MODE="npm"
			if [[ $# -ge 2 && ! "$2" =~ ^-- ]]; then
				PACKAGE_VERSION="$2"
				shift 2
			else
				shift
			fi
			;;
		--docker) MODE="docker"; shift ;;
		--start) START_N8N=1; shift ;;
		--no-start) START_N8N=0; shift ;;
		--install-n8n) INSTALL_N8N=1; shift ;;
		--user-folder)
			[[ $# -ge 2 ]] || die "--user-folder 需要路径参数"
			N8N_USER_FOLDER="$2"
			N8N_DATA_DIR="${N8N_USER_FOLDER}/.n8n"
			# Only reset custom if user did not set N8N_CUSTOM_EXTENSIONS / --custom-dir later
			if [[ -z "${N8N_CUSTOM_EXTENSIONS:-}" ]]; then
				CUSTOM_DIR="${N8N_DATA_DIR}/custom"
			fi
			shift 2
			;;
		--custom-dir)
			[[ $# -ge 2 ]] || die "--custom-dir 需要路径参数"
			CUSTOM_DIR="$2"
			shift 2
			;;
		--docker-name)
			[[ $# -ge 2 ]] || die "--docker-name 需要容器名"
			N8N_DOCKER_NAME="$2"
			shift 2
			;;
		--skip-build) SKIP_BUILD=1; shift ;;
		-h|--help) usage; exit 0 ;;
		*) die "未知参数: $1（使用 --help 查看用法）" ;;
	esac
done

# ---------- helpers ----------
prefer_node22() {
	# Node 26+ often breaks n8n native modules (isolated-vm). Prefer 22 LTS when available.
	if [[ -x "${NODE22_BIN}/node" ]]; then
		export PATH="${NODE22_BIN}:${PATH}"
		hash -r 2>/dev/null || true
	fi
}

check_node() {
	command -v node >/dev/null 2>&1 || die "未找到 node，请先安装 Node.js（推荐 22 LTS）"
	command -v npm >/dev/null 2>&1 || die "未找到 npm"

	local major
	major="$(node -p "process.versions.node.split('.')[0]")"
	info "Node $(node -v) · npm $(npm -v)"

	if (( major >= 26 )); then
		warn "当前 Node $(node -v) 过新，n8n / 原生模块可能安装失败"
		if [[ -x "${NODE22_BIN}/node" ]]; then
			warn "检测到 Node 22：${NODE22_BIN}，正在切换..."
			prefer_node22
			info "已切换到 Node $(node -v)"
		else
			warn "建议: brew install node@22"
			warn "然后: export PATH=\"/opt/homebrew/opt/node@22/bin:\$PATH\""
		fi
	elif (( major < 20 )); then
		die "Node $(node -v) 过旧，请升级到 Node 22 LTS（n8n 要求 >=20.19 / 推荐 22）"
	fi
}

read_package_name() {
	if [[ -n "${NODE_PACKAGE:-}" ]]; then
		printf '%s' "${NODE_PACKAGE}"
		return
	fi
	[[ -f "${ROOT_DIR}/package.json" ]] || die "未找到 package.json"
	node -p "require('${ROOT_DIR}/package.json').name" 2>/dev/null \
		|| die "无法读取 package.json 中的 name"
}

read_package_version() {
	node -p "require('${ROOT_DIR}/package.json').version" 2>/dev/null || echo "unknown"
}

# Prompt y/n; default_yes=1 means empty answer counts as yes
ask_yn() {
	local prompt="$1"
	local default_yes="${2:-0}"
	local answer suffix

	if [[ ! -t 0 ]]; then
		# Non-interactive: honor default
		[[ "${default_yes}" == "1" ]]
		return
	fi

	if [[ "${default_yes}" == "1" ]]; then
		suffix=" [Y/n] "
	else
		suffix=" [y/N] "
	fi

	printf '%s%s%s' "${C_BOLD}" "${prompt}${suffix}" "${C_RESET}"
	read -r answer || answer=""
	if [[ -z "${answer}" ]]; then
		[[ "${default_yes}" == "1" ]]
		return
	fi
	case "${answer}" in
		y|Y|yes|YES|Yes) return 0 ;;
		*) return 1 ;;
	esac
}

install_n8n_global() {
	info "全局安装 n8n（官方: npm install n8n -g）..."
	info "首次安装可能需要几分钟，请稍候..."
	npm install n8n -g
	hash -r 2>/dev/null || true
	command -v n8n >/dev/null 2>&1 || die "n8n 安装后仍找不到命令，请检查 npm 全局 bin 是否在 PATH 中: npm prefix -g"
	ok "n8n 安装完成: $(command -v n8n) ($(n8n --version 2>/dev/null || true))"
}

ensure_n8n_cli() {
	if command -v n8n >/dev/null 2>&1; then
		ok "已找到 n8n: $(command -v n8n)"
		return 0
	fi
	if [[ "${INSTALL_N8N}" == "1" ]]; then
		install_n8n_global
		return 0
	fi
	warn "本机未找到 n8n 命令（官方: npm install n8n -g）"
	return 1
}

# Ensure n8n exists before starting; offer install if missing
ensure_n8n_for_start() {
	if command -v n8n >/dev/null 2>&1; then
		return 0
	fi

	if [[ "${INSTALL_N8N}" == "1" ]]; then
		install_n8n_global
		return 0
	fi

	warn "未找到 n8n 命令"
	if ask_yn "是否现在执行 npm install n8n -g？" 1; then
		install_n8n_global
		return 0
	fi

	err "已取消安装 n8n，无法启动"
	warn "稍后可手动: npm install n8n -g && n8n start"
	return 1
}

# Official troubleshooting: create custom dir + npm init if missing
ensure_custom_dir() {
	local dir="$1"
	if [[ ! -d "${dir}" ]]; then
		info "创建 custom 目录（官方 troubleshooting）: ${dir}"
		mkdir -p "${dir}"
	fi
	if [[ ! -f "${dir}/package.json" ]]; then
		info "在 custom 目录执行 npm init -y"
		# npm init -y writes package.json; run from that directory
		(
			cd "${dir}"
			npm init -y >/dev/null
		)
		ok "已初始化 ${dir}/package.json"
	fi
}

ensure_nodes_dir() {
	# Community package install root (GUI / npm community nodes path): ~/.n8n/nodes
	local nodes_dir="${N8N_DATA_DIR}/nodes"
	mkdir -p "${nodes_dir}"
	if [[ ! -f "${nodes_dir}/package.json" ]]; then
		info "初始化 community nodes 目录: ${nodes_dir}"
		(
			cd "${nodes_dir}"
			npm init -y >/dev/null
		)
	fi
	printf '%s' "${nodes_dir}"
}

install_deps_and_build() {
	cd "${ROOT_DIR}"
	if [[ ! -d node_modules ]]; then
		info "安装项目依赖..."
		npm install
	fi

	if [[ "${SKIP_BUILD}" == "1" ]]; then
		warn "已跳过构建 (SKIP_BUILD=1 / --skip-build)"
		return
	fi

	info "构建节点包: npm run build"
	npm run build
	ok "构建完成"

	[[ -d "${ROOT_DIR}/dist" ]] || die "未找到 dist/，构建可能失败"
}

# Official path:
#   npm run build && npm link          # in node package
#   npm link <name>                    # in ~/.n8n/custom
deploy_official_link() {
	local pkg_name="$1"

	ensure_n8n_cli
	install_deps_and_build

	info "在节点目录执行 npm link ..."
	cd "${ROOT_DIR}"
	npm link
	ok "项目已全局 link: ${pkg_name}"

	ensure_custom_dir "${CUSTOM_DIR}"

	info "在 custom 目录执行: npm link ${pkg_name}"
	info "目录: ${CUSTOM_DIR}"
	cd "${CUSTOM_DIR}"
	npm link "${pkg_name}"

	local linked="${CUSTOM_DIR}/node_modules/${pkg_name}"
	if [[ -e "${linked}" ]]; then
		ok "已 link → ${linked}"
		if [[ -L "${linked}" ]]; then
			info "链接目标: $(readlink "${linked}" 2>/dev/null || readlink -f "${linked}" 2>/dev/null || true)"
		fi
	else
		die "link 后未找到 ${linked}，请检查包名是否与 package.json name 一致"
	fi

	ok "官方本地部署完成（${pkg_name}@$(read_package_version)）"
	cat <<EOF

${C_CYAN}${C_BOLD}按官方文档${C_RESET}
  打开浏览器: http://localhost:5678
  在节点面板搜索: ${C_BOLD}企业微信${C_RESET} / ${C_BOLD}WeCom${C_RESET}
  分类一般在: Communication / Custom Nodes

${C_DIM}注意: 启动 n8n 时不要设置 N8N_USER_FOLDER=~/.n8n
（正确默认是 HOME，数据目录才是 ~/.n8n，custom 才是 ~/.n8n/custom）${C_RESET}

${C_DIM}修改代码后请重新构建:${C_RESET}
  npm run build
  # 或持续监听
  npm run build:watch
  # 然后重启 n8n

${C_DIM}文档: https://docs.n8n.io/connect/create-nodes/test-your-node/run-your-node-locally${C_RESET}
EOF
}

deploy_from_npm() {
	local pkg_name="$1"
	local nodes_dir
	nodes_dir="$(ensure_nodes_dir)"

	info "从 npm 安装 ${pkg_name}@${PACKAGE_VERSION} → ${nodes_dir}"
	cd "${nodes_dir}"
	npm install "${pkg_name}@${PACKAGE_VERSION}" --no-fund --no-audit
	ok "已安装 ${pkg_name}@${PACKAGE_VERSION}"
}

deploy_docker() {
	local pkg_name="$1"
	local tarball container_custom

	command -v docker >/dev/null 2>&1 || die "未找到 docker 命令"
	docker inspect "${N8N_DOCKER_NAME}" >/dev/null 2>&1 \
		|| die "Docker 容器不存在: ${N8N_DOCKER_NAME}（可用 --docker-name 指定）"
	docker inspect -f '{{.State.Running}}' "${N8N_DOCKER_NAME}" 2>/dev/null | grep -qx true \
		|| die "Docker 容器未在运行: ${N8N_DOCKER_NAME}"

	install_deps_and_build

	info "打包本地版本: npm pack"
	cd "${ROOT_DIR}"
	tarball="$(npm pack --silent)"
	[[ -f "${ROOT_DIR}/${tarball}" ]] || die "npm pack 失败"

	# Official image data dir; private nodes often go under custom
	container_custom="/home/node/.n8n/custom"
	info "复制到容器 ${N8N_DOCKER_NAME}:${container_custom}/"
	docker exec -u root "${N8N_DOCKER_NAME}" mkdir -p "${container_custom}"
	docker cp "${ROOT_DIR}/${tarball}" "${N8N_DOCKER_NAME}:${container_custom}/${tarball}"

	info "在容器 custom 目录安装..."
	docker exec -u root -w "${container_custom}" "${N8N_DOCKER_NAME}" sh -c "
		set -e
		if [ ! -f package.json ]; then
			npm init -y >/dev/null 2>&1 || printf '%s\n' '{\"name\":\"n8n-custom\",\"private\":true}' > package.json
		fi
		npm install './${tarball}' --no-fund --no-audit
		rm -f './${tarball}'
		chown -R node:node '${container_custom}' 2>/dev/null || true
	"

	rm -f "${ROOT_DIR}/${tarball}"
	ok "已部署 ${pkg_name} 到 Docker 容器 ${N8N_DOCKER_NAME}"
}

# Ask y/n whether to start n8n (every deploy mode ends here)
# Returns 0 if user wants to start, 1 otherwise.
confirm_start_n8n() {
	if [[ "${START_N8N}" == "1" ]]; then
		return 0
	fi
	if [[ "${START_N8N}" == "0" ]]; then
		return 1
	fi

	# Non-interactive (no TTY): default to no
	if [[ ! -t 0 ]]; then
		warn "非交互环境，跳过启动 n8n（可用 --start 强制启动）"
		return 1
	fi

	echo
	if [[ "${MODE}" == "docker" ]]; then
		ask_yn "是否重启 Docker 容器「${N8N_DOCKER_NAME}」中的 n8n 以加载节点？" 0
	else
		ask_yn "是否启动 n8n？" 0
	fi
}

# Stop previous local n8n so the port is free before start
stop_existing_n8n() {
	local port="${N8N_PORT:-5678}"
	local pids=()
	local pid
	local killed=0

	info "检查并停止已有 n8n 实例（端口 ${port}）..."

	# 1) Processes listening on the n8n port
	if command -v lsof >/dev/null 2>&1; then
		while IFS= read -r pid; do
			[[ -n "${pid}" ]] && pids+=("${pid}")
		done < <(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)
	fi

	# 2) Known n8n CLI / task-runner processes (avoid killing this script)
	while IFS= read -r pid; do
		[[ -n "${pid}" ]] && pids+=("${pid}")
	done < <(pgrep -f 'node_modules/n8n(/| )|n8n/bin/n8n|/bin/n8n start|n8n start' 2>/dev/null || true)

	# Unique PIDs (bash 3.2 compatible), skip self / parent
	local uniq_pids=""
	for pid in "${pids[@]+"${pids[@]}"}"; do
		[[ -z "${pid}" ]] && continue
		[[ "${pid}" == "$$" || "${pid}" == "${PPID}" ]] && continue
		case " ${uniq_pids} " in
			*" ${pid} "*) ;;
			*) uniq_pids="${uniq_pids} ${pid}" ;;
		esac
	done
	uniq_pids="${uniq_pids# }"

	if [[ -z "${uniq_pids}" ]]; then
		ok "未发现运行中的 n8n"
		return 0
	fi

	info "结束进程: ${uniq_pids}"
	# shellcheck disable=SC2086
	kill ${uniq_pids} 2>/dev/null || true
	killed=1

	# Wait up to ~10s for exit; then SIGKILL leftovers
	local i still
	for i in $(seq 1 20); do
		still=""
		for pid in ${uniq_pids}; do
			if kill -0 "${pid}" 2>/dev/null; then
				still="${still} ${pid}"
			fi
		done
		still="${still# }"
		if [[ -z "${still}" ]]; then
			break
		fi
		if [[ "${i}" -eq 10 ]]; then
			warn "进程未退出，发送 SIGKILL: ${still}"
			# shellcheck disable=SC2086
			kill -9 ${still} 2>/dev/null || true
		fi
		sleep 0.5
	done

	# Final port check
	if command -v lsof >/dev/null 2>&1; then
		local left
		left="$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)"
		if [[ -n "${left}" ]]; then
			warn "端口 ${port} 仍被占用 (PID: ${left})，强制结束..."
			# shellcheck disable=SC2086
			kill -9 ${left} 2>/dev/null || true
			sleep 0.5
		fi
	fi

	if [[ "${killed}" -eq 1 ]]; then
		ok "已停止旧 n8n 实例"
	fi
}

start_n8n_after_deploy() {
	if ! confirm_start_n8n; then
		info "已跳过启动 n8n"
		if [[ "${MODE}" == "docker" ]]; then
			warn "节点已写入容器，稍后请手动: docker restart ${N8N_DOCKER_NAME}"
		else
			warn "稍后可手动执行: n8n  或  n8n start"
		fi
		return 0
	fi

	if [[ "${MODE}" == "docker" ]]; then
		info "重启容器 ${N8N_DOCKER_NAME} ..."
		docker restart "${N8N_DOCKER_NAME}" >/dev/null
		ok "容器已重启，n8n 应已加载节点"
		return 0
	fi

	# link / npm: ensure local n8n CLI exists (offer install), then start
	ensure_n8n_for_start || return 1

	# Always free the previous instance first (avoids "port 5678 is already in use")
	stop_existing_n8n

	info "启动 n8n ..."
	info "数据目录: ${N8N_DATA_DIR}"
	info "自定义节点: ${CUSTOM_DIR}"

	# Only set N8N_USER_FOLDER when non-default (default is $HOME)
	if [[ "${N8N_USER_FOLDER}" != "${HOME}" ]]; then
		export N8N_USER_FOLDER
	else
		unset N8N_USER_FOLDER 2>/dev/null || true
	fi
	# Extra custom dirs via official env (optional)
	if [[ -n "${N8N_CUSTOM_EXTENSIONS:-}" ]]; then
		export N8N_CUSTOM_EXTENSIONS
	elif [[ "${CUSTOM_DIR}" != "${N8N_DATA_DIR}/custom" ]]; then
		export N8N_CUSTOM_EXTENSIONS="${CUSTOM_DIR}"
	fi

	# Prefer Node 22 for runtime (native modules)
	prefer_node22
	exec n8n start
}

# ---------- main ----------
main() {
	printf '%s\n' "${C_BOLD}n8n 社区节点一键部署${C_RESET}"
	printf '%s\n' "${C_DIM}官方: Run your node locally · mode=${MODE}${C_RESET}"
	printf '%s\n' "${C_DIM}root=${ROOT_DIR}${C_RESET}"
	echo

	prefer_node22
	check_node

	local pkg_name
	pkg_name="$(read_package_name)"
	info "包名 (package.json name): ${pkg_name}"
	info "N8N_USER_FOLDER: ${N8N_USER_FOLDER}  → 数据: ${N8N_DATA_DIR}"
	info "custom 目录: ${CUSTOM_DIR}"

	case "${MODE}" in
		link)   deploy_official_link "${pkg_name}" ;;
		npm)    deploy_from_npm "${pkg_name}" ;;
		docker) deploy_docker "${pkg_name}" ;;
		*)      die "未知模式: ${MODE}" ;;
	esac

	echo
	ok "部署完成"
	start_n8n_after_deploy
}

main
