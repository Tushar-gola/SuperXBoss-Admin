const initialState = false;
const loaderWorking = (state = initialState, action) => {
    switch (action.type) {
        case "LOADER":
            return state = action.payload;
        
        default:
            return state
    }
}
export default loaderWorking;