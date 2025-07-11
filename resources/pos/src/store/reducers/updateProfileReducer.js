import {profileActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case profileActionType.FETCH_PROFILE:
        case profileActionType.UPDATE_PROFILE:
            return action.payload;
        case profileActionType.DELETE_PROFILE_IMAGE:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    image: ''
                }
            };
        default:
            return state;
    }
}
