import { Button, Modal } from 'react-bootstrap';

import { ReactComponent as Class } from 'src/assets/legend/class.svg';
import { ReactComponent as Class_dark } from 'src/assets/legend/class_dark.svg';
import { ReactComponent as Dictionary } from 'src/assets/legend/dictionary.svg';
import { ReactComponent as Dictionary_dark } from 'src/assets/legend/dictionary_dark.svg';
import { ReactComponent as List } from 'src/assets/legend/list.svg';
import { ReactComponent as List_dark } from 'src/assets/legend/list_dark.svg';
import { ReactComponent as Object } from 'src/assets/legend/object.svg';
import { ReactComponent as Object_dark } from 'src/assets/legend/object_dark.svg';
import { ReactComponent as Old_reference } from 'src/assets/legend/old_reference.svg';
import { ReactComponent as Reference } from 'src/assets/legend/reference.svg';
import { ReactComponent as Reference_dark } from 'src/assets/legend/reference_dark.svg';
import { ReactComponent as Set } from 'src/assets/legend/set.svg';
import { ReactComponent as Set_dark } from 'src/assets/legend/set_dark.svg';
import { ReactComponent as Tuple } from 'src/assets/legend/tuple.svg';
import { ReactComponent as Tuple_dark } from 'src/assets/legend/tuple_dark.svg';
import { ReactComponent as Variable } from 'src/assets/legend/variable.svg';
import { ReactComponent as Variable_dark } from 'src/assets/legend/variable_dark.svg';
import styles from 'src/features/visual-box/Legend.module.css';

const svg_size = { width: 100, height: 100 };

// ### TODO: let App.js host the dark mode state ###
const Legend = ({ show, setShow }) => {
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} scrollable={true}>
      <Modal.Header className={styles.modal}>
        <Modal.Title>Graph Elements</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modal}>
        <ul>
          <li>
            {document.body.classList.contains('dark') ? (
              <Variable_dark style={svg_size} title="Ellipse" />
            ) : (
              <Variable style={svg_size} title="Ellipse" />
            )}
            Variable
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Object_dark style={svg_size} title="Rectangle" />
            ) : (
              <Object style={svg_size} title="Rectangle" />
            )}
            Object
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Reference_dark style={svg_size} title="Arrow" />
            ) : (
              <Reference style={svg_size} title="Arrow" />
            )}
            Reference
          </li>
          <li>
            <Old_reference style={svg_size} title="Dotted Arrow" />
            Old Reference
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <List_dark style={svg_size} title="List element" />
            ) : (
              <List style={svg_size} title="List element" />
            )}
            List
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Tuple_dark style={svg_size} title="Tuple element" />
            ) : (
              <Tuple style={svg_size} title="Tuple element" />
            )}
            Tuple
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Dictionary_dark style={svg_size} title="Dictionary element" />
            ) : (
              <Dictionary style={svg_size} title="Dictionary element" />
            )}
            Dictionary
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Class_dark style={svg_size} title="Class element" />
            ) : (
              <Class style={svg_size} title="Class element" />
            )}
            Class
          </li>
          <li>
            {document.body.classList.contains('dark') ? (
              <Set_dark style={svg_size} title="Set element" />
            ) : (
              <Set style={svg_size} title="Set element" />
            )}
            Set
          </li>
        </ul>
      </Modal.Body>
      <Modal.Footer className={styles.modal}>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Legend;
