import type {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { sendTemplateCardDescription } from '../message/sendTemplateCard';

const excludedFields = new Set([
	'recipientType',
	'touser',
	'toparty',
	'totag',
	'touser_manual',
	'toparty_manual',
	'totag_manual',
	'enable_id_trans',
	'enable_duplicate_check',
	'duplicate_check_interval',
]);

/** 复用应用消息的完整五类模板卡片表单，并切换到智能机器人回复场景。 */
export function templateCardFormProperties(
	showBase: NonNullable<IDisplayOptions['show']>,
): INodeProperties[] {
	return sendTemplateCardDescription
		.filter((property) => !excludedFields.has(property.name))
		.map((property): INodeProperties => ({
			...property,
			displayOptions: {
				...property.displayOptions,
				show: {
					...(property.displayOptions?.show ?? {}),
					...showBase,
				},
			},
		}));
}

function compactObject(value: IDataObject | undefined): IDataObject | undefined {
	if (!value) return undefined;
	const compacted: IDataObject = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === undefined || entry === null || (typeof entry === 'string' && !entry.trim())) continue;
		compacted[key] = typeof entry === 'string' ? entry.trim() : entry;
	}
	return Object.keys(compacted).length ? compacted : undefined;
}

function compactAction(value: IDataObject | undefined): IDataObject | undefined {
	const action = compactObject(value);
	if (!action) return undefined;
	const type = Number(action.type ?? 0);
	if (type !== 1) delete action.url;
	if (type !== 2) {
		delete action.appid;
		delete action.pagepath;
	}
	return action;
}

function compactItems(value: unknown): IDataObject[] {
	return Array.isArray(value)
		? value.map((entry) => compactObject(entry as IDataObject) ?? {})
		: [];
}

function compactHorizontalItem(value: IDataObject): IDataObject {
	const item = compactObject(value) ?? {};
	const type = Number(item.type ?? 0);
	if (type !== 1) delete item.url;
	if (type !== 2) delete item.media_id;
	if (type !== 3) delete item.userid;
	return item;
}

/** 从复用表单构建标准 template_card 对象。 */
export function buildTemplateCardFromForm(
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const cardType = context.getNodeParameter('card_type', itemIndex) as string;
	const templateCard: IDataObject = { card_type: cardType };

	const sourceData = context.getNodeParameter('source', itemIndex, {}) as IDataObject;
	const source = compactObject(sourceData.sourceInfo as IDataObject | undefined);
	if (source) templateCard.source = source;

	const mainTitleData = context.getNodeParameter('main_title', itemIndex, {}) as IDataObject;
	templateCard.main_title = compactObject(mainTitleData.titleInfo as IDataObject | undefined) ?? {};

	const emphasisData = context.getNodeParameter('emphasis_content', itemIndex, {}) as IDataObject;
	const emphasis = compactObject(emphasisData.emphasisInfo as IDataObject | undefined);
	if (emphasis) templateCard.emphasis_content = emphasis;

	const quoteData = context.getNodeParameter('quote_area', itemIndex, {}) as IDataObject;
	const quote = compactAction(quoteData.quoteInfo as IDataObject | undefined);
	if (quote) templateCard.quote_area = quote;

	const subTitle = (context.getNodeParameter('sub_title_text', itemIndex, '') as string).trim();
	if (subTitle) templateCard.sub_title_text = subTitle;

	const horizontalData = context.getNodeParameter(
		'horizontal_content_list',
		itemIndex,
		{},
	) as IDataObject;
	if (Array.isArray(horizontalData.items) && horizontalData.items.length) {
		templateCard.horizontal_content_list = horizontalData.items.map(
			(entry) => compactHorizontalItem(entry as IDataObject),
		);
	}

	const jumpData = context.getNodeParameter('jump_list', itemIndex, {}) as IDataObject;
	if (Array.isArray(jumpData.items) && jumpData.items.length) {
		templateCard.jump_list = jumpData.items.map(
			(entry) => compactAction(entry as IDataObject) ?? {},
		);
	}

	const cardActionData = context.getNodeParameter('card_action', itemIndex, {}) as IDataObject;
	const cardAction = compactAction(cardActionData.actionInfo as IDataObject | undefined);
	if (cardAction) templateCard.card_action = cardAction;

	const taskId = (context.getNodeParameter('task_id', itemIndex, '') as string).trim();
	if (taskId) templateCard.task_id = taskId;

	if (cardType === 'button_interaction') {
		const buttonData = context.getNodeParameter('button_list', itemIndex, {}) as IDataObject;
		if (Array.isArray(buttonData.buttons)) {
			templateCard.button_list = buttonData.buttons.map((rawButton) => {
				const button = compactObject(rawButton as IDataObject) ?? {};
				const type = Number(button.type ?? 0);
				if (type !== 0) delete button.key;
				if (type !== 1) delete button.url;
				return button;
			});
		}
		const selectionData = context.getNodeParameter('button_selection', itemIndex, {}) as IDataObject;
		const selection = compactObject(selectionData.selectionInfo as IDataObject | undefined);
		if (selection) {
			const optionData = selection.option_list as IDataObject | undefined;
			selection.option_list = compactItems(optionData?.options);
			templateCard.button_selection = selection;
		}
	} else if (cardType === 'vote_interaction') {
		const optionData = context.getNodeParameter('option_list', itemIndex, {}) as IDataObject;
		templateCard.checkbox = {
			question_key: (context.getNodeParameter(
				'checkbox_question_key',
				itemIndex,
				'',
			) as string).trim(),
			mode: context.getNodeParameter('checkbox_mode', itemIndex, 0) as number,
			disable: context.getNodeParameter('checkbox_disable', itemIndex, false) as boolean,
			option_list: compactItems(optionData.options),
		};
	} else if (cardType === 'multiple_interaction') {
		const selectData = context.getNodeParameter('select_list', itemIndex, {}) as IDataObject;
		const selectors = Array.isArray(selectData.selectors)
			? selectData.selectors.map((rawSelector) => {
				const selector = compactObject(rawSelector as IDataObject) ?? {};
				const optionData = selector.option_list as IDataObject | undefined;
				selector.option_list = compactItems(optionData?.options);
				return selector;
			})
			: [];
		templateCard.select_list = selectors;
	}

	if (['vote_interaction', 'multiple_interaction'].includes(cardType)) {
		const submitKey = (context.getNodeParameter('submit_button_key', itemIndex, '') as string).trim();
		if (submitKey) {
			templateCard.submit_button = {
				text: (context.getNodeParameter(
					'submit_button_text',
					itemIndex,
					'提交',
				) as string).trim(),
				key: submitKey,
			};
		}
	}

	if (cardType === 'news_notice') {
		const cardImageData = context.getNodeParameter('card_image', itemIndex, {}) as IDataObject;
		const cardImage = compactObject(cardImageData.imageInfo as IDataObject | undefined);
		if (cardImage) templateCard.card_image = cardImage;

		const imageTextData = context.getNodeParameter(
			'image_text_area',
			itemIndex,
			{},
		) as IDataObject;
		const imageText = compactAction(imageTextData.imageTextInfo as IDataObject | undefined);
		if (imageText) templateCard.image_text_area = imageText;

		const verticalData = context.getNodeParameter(
			'vertical_content_list',
			itemIndex,
			{},
		) as IDataObject;
		if (Array.isArray(verticalData.items) && verticalData.items.length) {
			templateCard.vertical_content_list = compactItems(verticalData.items);
		}
	}

	const actionMenuData = context.getNodeParameter('action_menu', itemIndex, {}) as IDataObject;
	const actionMenu = compactObject(actionMenuData.menuInfo as IDataObject | undefined);
	if (actionMenu) {
		const listData = actionMenu.action_list as IDataObject | undefined;
		const actions = compactItems(listData?.actions);
		delete actionMenu.action_list;
		if (actions.length) actionMenu.action_list = actions;
		templateCard.action_menu = actionMenu;
	}

	return templateCard;
}
