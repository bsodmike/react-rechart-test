// Created with https://app.quicktype.io/
// 
// To parse this data:
//
//   import { Convert, Tasks } from "./file";
//
//   const tasks = Convert.toTasks(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Tasks {
    tasks: Task[];
}

export interface Task {
    timestamp:                           Date;
    metadata:                            Metadata;
    start_on:                            null;
    completed_calendarweek:              null;
    due_on:                              null;
    modified_at:                         Date;
    due_calendarweek:                    null;
    projects:                            Project[] | null;
    main_project_gid?:                   string;
    hours_total_self:                    null;
    is_summary_task:                     boolean;
    completed_at:                        Date | null;
    custom_fields:                       any[];
    hours_completed_subtasks:            null;
    num_subtasks:                        number;
    hours_completed_self:                number | null;
    resource_subtype?:                   string;
    hours_incomplete_task_incl_subtasks: number | null;
    created_at:                          Date | null;
    assignee_mail:                       null;
    hours_completed_task_incl_subtasks:  number | null;
    rootparent_gid:                      null;
    subtasks:                            any[] | null;
    assignee:                            null;
    name?:                               string;
    hours_max_task_incl_subtasks:        null;
    hours_incomplete_self:               number | null;
    gid:                                 string;
    completed:                           boolean | null;
    parent:                              null;
    hours_total_subtasks:                null;
    hours_total_task_incl_subtasks:      null;
    name_clean:                          null | string;
    __v:                                 number;
    accounting_type:                     null;
    _id:                                 string;
    html_notes:                          string;
    hours_incomplete_subtasks:           null;
    subtask_level:                       null;
    deleted?:                            boolean;
}

export interface Metadata {
    task_gid: string;
    type:     string;
}

export interface Project {
    gid:           string;
    resource_type: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTasks(json: string): Tasks {
        return cast(JSON.parse(json), r("Tasks"));
    }

    public static tasksToJson(value: Tasks): string {
        return JSON.stringify(uncast(value, r("Tasks")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Tasks": o([
        { json: "tasks", js: "tasks", typ: a(r("Task")) },
    ], false),
    "Task": o([
        { json: "timestamp", js: "timestamp", typ: Date },
        { json: "metadata", js: "metadata", typ: r("Metadata") },
        { json: "start_on", js: "start_on", typ: null },
        { json: "completed_calendarweek", js: "completed_calendarweek", typ: null },
        { json: "due_on", js: "due_on", typ: null },
        { json: "modified_at", js: "modified_at", typ: Date },
        { json: "due_calendarweek", js: "due_calendarweek", typ: null },
        { json: "projects", js: "projects", typ: u(a(r("Project")), null) },
        { json: "main_project_gid", js: "main_project_gid", typ: u(undefined, "") },
        { json: "hours_total_self", js: "hours_total_self", typ: null },
        { json: "is_summary_task", js: "is_summary_task", typ: true },
        { json: "completed_at", js: "completed_at", typ: u(Date, null) },
        { json: "custom_fields", js: "custom_fields", typ: a("any") },
        { json: "hours_completed_subtasks", js: "hours_completed_subtasks", typ: null },
        { json: "num_subtasks", js: "num_subtasks", typ: 0 },
        { json: "hours_completed_self", js: "hours_completed_self", typ: u(0, null) },
        { json: "resource_subtype", js: "resource_subtype", typ: u(undefined, "") },
        { json: "hours_incomplete_task_incl_subtasks", js: "hours_incomplete_task_incl_subtasks", typ: u(0, null) },
        { json: "created_at", js: "created_at", typ: u(Date, null) },
        { json: "assignee_mail", js: "assignee_mail", typ: null },
        { json: "hours_completed_task_incl_subtasks", js: "hours_completed_task_incl_subtasks", typ: u(0, null) },
        { json: "rootparent_gid", js: "rootparent_gid", typ: null },
        { json: "subtasks", js: "subtasks", typ: u(a("any"), null) },
        { json: "assignee", js: "assignee", typ: null },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "hours_max_task_incl_subtasks", js: "hours_max_task_incl_subtasks", typ: null },
        { json: "hours_incomplete_self", js: "hours_incomplete_self", typ: u(0, null) },
        { json: "gid", js: "gid", typ: "" },
        { json: "completed", js: "completed", typ: u(true, null) },
        { json: "parent", js: "parent", typ: null },
        { json: "hours_total_subtasks", js: "hours_total_subtasks", typ: null },
        { json: "hours_total_task_incl_subtasks", js: "hours_total_task_incl_subtasks", typ: null },
        { json: "name_clean", js: "name_clean", typ: u(null, "") },
        { json: "__v", js: "__v", typ: 0 },
        { json: "accounting_type", js: "accounting_type", typ: null },
        { json: "_id", js: "_id", typ: "" },
        { json: "html_notes", js: "html_notes", typ: "" },
        { json: "hours_incomplete_subtasks", js: "hours_incomplete_subtasks", typ: null },
        { json: "subtask_level", js: "subtask_level", typ: null },
        { json: "deleted", js: "deleted", typ: u(undefined, true) },
    ], false),
    "Metadata": o([
        { json: "task_gid", js: "task_gid", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "Project": o([
        { json: "gid", js: "gid", typ: "" },
        { json: "resource_type", js: "resource_type", typ: "" },
    ], false),
};
