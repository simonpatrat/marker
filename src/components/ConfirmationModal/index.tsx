import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

export const ConfirmationModal: React.FunctionComponent<{
  confirmCallback: () => void;
  modalTriggerElement: React.ReactNode;
}> = ({ confirmCallback, modalTriggerElement }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={(): void => setOpen(false)}
      onOpen={(): void => setOpen(true)}
      open={open}
      size="small"
      trigger={modalTriggerElement}
    >
      <Header icon>
        <Icon name="warning sign" />
        Attention
      </Header>
      <Modal.Content>
        <p>Êtes vous sûr de vouloir effacer le bookmark ?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" onClick={(): void => setOpen(false)}>
          <Icon name="remove" /> Non
        </Button>
        <Button
          color="green"
          onClick={(): void => {
            setOpen(false);
            confirmCallback();
          }}
        >
          <Icon name="checkmark" /> Oui
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
