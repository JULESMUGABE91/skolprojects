import React from "react";
import { Button } from "../Button";
import { Input } from "../Input";

const DeleteOperator = (props) => {
  return (
    <div className="card">
      <div className="card-body">
        <Input
          type="password"
          label="Enter your password to confirm"
          value={props.password}
          error={props.error}
          autocomplete="off"
          autocomplete="chrome-off"
          autocomplete="new-password"
          onChange={(e) => props.onChangePassword("delete_password", e)}
        />
      </div>
      <div className="modal-footer">
        <Button
          text="Cancel"
          className="btn-default border"
          onPress={() => props.handleCloseModal()}
        />

        <Button
          text="Delete"
          className="btn-primary"
          onPress={() => props.onDelete()}
          isSubmitting={props.isDeleting}
        />
      </div>
    </div>
  );
};

export default DeleteOperator;
