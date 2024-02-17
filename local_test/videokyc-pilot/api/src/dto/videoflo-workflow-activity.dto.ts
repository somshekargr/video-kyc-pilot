export class ActivityConfig {
    gatherFrom: string[];
    displayTo?: string[];
    configuration?: any;
    onActivityDataGathered?: string;
    onActivityAction?: string;
}

export class WorkflowActivity extends ActivityConfig {
    id: string;
    activityType: string;
}
