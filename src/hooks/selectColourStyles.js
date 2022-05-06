const colourStyles = {
    control: (styles, state) => ({
        ...styles, backgroundColor: "white", borderRadius: state.isFocused ? "3px 3px 0 0" : 3, cursor: "pointer",
        boxShadow: state.isFocused ? null : null,
        "&:focus-within": {
            borderColor: state.isFocused ? "orange" : "blue"
        }
    }),
    option: (styles, { isDisabled, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isSelected ? "#ff8f00" : "white",
            color: isSelected ? "white" : "black",
            cursor: isDisabled ? "not-allowed" : "pointer",
            "&:hover": {
                backgroundColor: isSelected ? "#ff8f00" : "#FFEED9"
            }
        };
    },
    singleValue: (styles, state) => ({
        ...styles, color: "#ff8f00", fontWeight: "500"
    }),
    dropdownIndicator: styles => ({
        ...styles,
        color: "#ff8f00" // Custom colour
    })
};

export default colourStyles;