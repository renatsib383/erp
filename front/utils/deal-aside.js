export const filterForm = {
    uid: '',
    uidEmpty: false,
    stages: {
        selectedStages: [],
        stagesExceptFor: false,
    },
    budget_sum: {
        from: '',
        to: '',
        exceptFor: false,
    },
    created_at: [],
    updated_at: [],
    facility_type: [],
    facility_type_options: [],
    facility_condition: [],
    facility_condition_options: [],
    region: '',
    region_options: [],
    zamer_date: [],
    zamer_time: [],
    task: {
        format: 'range',
        startDate: null,
        endDate: null,
        lastDays: 0,
        performer: [],
        performer_options: []
    },
    withoutTasks: false,
    delay: null,
};