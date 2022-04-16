import rule from "../lib/rules/node-param-multi-options-type-unsorted-items";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: 'a',
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
					},
				],
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: 'a',
				options: [
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
					},
				],
			};`,
      errors: [
        { messageId: "sortItems", data: { displayOrder: "A | B | C | D | E" } },
      ],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: 'a',
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
					},
				],
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The operation to perform.',
				options: [
					{
						name: 'Invoice Generated',
						value: 'invoice_generated',
						description: 'Event triggered when a new invoice is generated. In case of metered billing, this event is triggered when a "Pending" invoice is closed.',
					},
					{
						name: 'Date Equal',
						value: 'date_equal',
						description: 'Field is date. Format: \\'YYYY-MM-DD\\'',
					},
					{
						name: 'Invoice Deleted',
						value: 'invoice_deleted',
						description: 'Event triggered when an invoice is deleted.',
					},
					{
						name: 'Subscription Renewal Reminder',
						value: 'subscription_renewal_reminder',
						description: 'Triggered 3 days before each subscription\\'s renewal.',
					},
					{
						name: 'Transaction Created',
						value: 'transaction_created',
						description: 'Triggered when a transaction is recorded.',
					},
					{
						name: 'Transaction Updated',
						value: 'transaction_updated',
						description: 'Triggered when a transaction is updated. E.g. (1) When a transaction is removed, (2) or when an excess payment is applied on an invoice, (3) or when amount_capturable gets updated.',
					},
					{
						name: 'Transaction Deleted',
						value: 'transaction_deleted',
						description: 'Triggered when a transaction is deleted.',
					},
				],
			};`,
      errors: [
        {
          messageId: "sortItems",
          data: {
            displayOrder:
              "Date Equal | Invoice Deleted | Invoice Generated | Subscription Renewal Reminder | Transaction Created | Transaction Deleted | Transaction Updated",
          },
        },
      ],
      output: outdent`
			const test = {
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The operation to perform.',
				options: [
					{
						name: 'Date Equal',
						value: 'date_equal',
						description: 'Field is date. Format: \\'YYYY-MM-DD\\'',
					},
					{
						name: 'Invoice Deleted',
						value: 'invoice_deleted',
						description: 'Event triggered when an invoice is deleted.',
					},
					{
						name: 'Invoice Generated',
						value: 'invoice_generated',
						description: 'Event triggered when a new invoice is generated. In case of metered billing,	this event is triggered when a	\\'Pending\\'	invoice is closed.',
					},
					{
						name: 'Subscription Renewal Reminder',
						value: 'subscription_renewal_reminder',
						description: 'Triggered 3 days before each subscription\\'s renewal.',
					},
					{
						name: 'Transaction Created',
						value: 'transaction_created',
						description: 'Triggered when a transaction is recorded.',
					},
					{
						name: 'Transaction Deleted',
						value: 'transaction_deleted',
						description: 'Triggered when a transaction is deleted.',
					},
					{
						name: 'Transaction Updated',
						value: 'transaction_updated',
						description: 'Triggered when a transaction is updated. E.g.	(1)	When a transaction is removed,	(2)	or when an excess payment is applied on an invoice,	(3)	or when amount_capturable gets updated.',
					},
				],
			};`,
    },
  ],
});
