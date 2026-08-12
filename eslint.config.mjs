import { configWithoutCloudSupport as config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		ignores: ['scripts/**'],
	},
	{
		rules: {
			// Disable sorting rule for Chinese characters
			'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
			// Disable boolean description rule for Chinese content
			'n8n-nodes-base/node-param-description-boolean-without-whether': 'off',
			'n8n-nodes-base/node-param-description-wrong-for-limit': 'off',
			'n8n-nodes-base/node-param-description-excess-final-period': 'off',
			'n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options': 'off',
			'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
			'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
			// Allow Chinese trigger suffix instead of '-Trigger'
			'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'off',
			'n8n-nodes-base/node-param-placeholder-miscased-id': 'off',
			'n8n-nodes-base/node-param-option-description-identical-to-name': 'off',
			'n8n-nodes-base/node-param-collection-type-unsorted-items': 'off',
			'n8n-nodes-base/node-param-operation-option-action-miscased': 'off',
			// These rules crash on operation option arrays containing spread elements
			'n8n-nodes-base/node-param-operation-option-action-wrong-for-get-many': 'off',
			'n8n-nodes-base/node-param-operation-option-description-wrong-for-get-many': 'off',
			// Preserve Chinese and API-native field wording in node descriptions
			'n8n-nodes-base/node-param-description-lowercase-first-char': 'off',
			'n8n-nodes-base/node-param-description-miscased-id': 'off',
			'n8n-nodes-base/node-param-description-miscased-url': 'off',
			'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'off',
			'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options': 'off',
			'n8n-nodes-base/cred-class-field-display-name-missing-api': 'off',
			'n8n-nodes-base/node-param-display-name-miscased': 'off',
			'n8n-nodes-base/node-param-default-wrong-for-limit': 'off',
			'n8n-nodes-base/node-param-min-value-wrong-for-limit': 'off',
		},
	},
];
