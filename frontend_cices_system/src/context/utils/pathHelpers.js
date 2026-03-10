import { produce } from "immer";

export const setByPath = (setState, path, value) => {

    setState(prev =>
        produce(prev, draft => {

            let ref = draft;

            for (let i = 0; i < path.length - 1; i++) {
                ref = ref[path[i]];
            }

            ref[path[path.length - 1]] = value;
        })
    );
};

export const addByPath = (setState, path, value) => {

    setState(prev =>
        produce(prev, draft => {

            let ref = draft;

            for (let i = 0; i < path.length; i++) {
                ref = ref[path[i]];
            }

            ref.push(value);
        })
    );
};

export const removeByPath = (setState, path, index) => {

    setState(prev =>
        produce(prev, draft => {

            let ref = draft;

            for (let i = 0; i < path.length; i++) {
                ref = ref[path[i]];
            }

            ref.splice(index, 1);
        })
    );
};