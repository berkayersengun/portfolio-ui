import React from "react";
import { Modal, Button } from "react-bootstrap";
import Axios from "../services/axios";

const DeleteModal = ({
  deleteModal,
  setDeleteModal,
  popups,
  setPopups,
  setTimerId,
}) => {
  const onClickDelete = () => {
    const pops = popups;
    deleteModal.entities.forEach((entity) => {
      new Axios()
        .deleteHolding(entity["id"])
        .then(() => {
          const msg = `ID:${entity["id"]}, ${entity["name"]} deleted successfully.`;
          pops.push({ isError: false, msg: msg, show: true });
          setPopups(pops);
        })
        .catch((error) => {
          const msg = `ID:${entity["id"]}, ${entity["name"]} ::  ${error.response.data.detail}`;
          pops.push({ isError: true, msg: msg, show: true });
          setPopups(pops);
        })
        .finally(() => {
          setTimerId(0);
        });
    });
    onclickClose();
  };

  const onclickClose = () => {
    setDeleteModal({
      show: false,
      entities: [],
    });
  };

  return (
    <>
      <Modal
        show={deleteModal.show}
        onHide={onclickClose}
        animation={false}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Asset(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Asset with ids will be deleted:
          <ul>
            {deleteModal.entities.map((entity, idx) => (
              <li key={idx}>
                {entity["id"]}: {entity["name"]} ({entity["symbol"]}, Quantity:{" "}
                {entity["quantity"]})
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onclickClose}>
            Cancel
          </Button>
          <Button variant="outline-danger" onClick={onClickDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteModal;
