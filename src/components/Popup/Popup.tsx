import React, { FunctionComponent } from "react";

interface PopupProps {
    creationDate: string;
}

const Popup: FunctionComponent<PopupProps> = ({ creationDate }) => {
    return (
        <h1>{creationDate}</h1>
    )
};

export default Popup;
