import { WORK_ORDER_ISSUES_GROUP } from 'src/sections/settings/settings-constants';
import { GenericOptionSettings } from 'src/sections/settings/generic/generic-option-settings';

export function WorkOrderIssueSettings() {
    return (
        <GenericOptionSettings
            title="Work Order Issues"
            group={WORK_ORDER_ISSUES_GROUP}
            addButtonLabel="Add Issue"
            usageFor="workOrder"
            usageField="issues.issue"
        />
    );
}
