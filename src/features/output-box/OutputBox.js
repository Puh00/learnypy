import React from 'react';

import border from 'src/features/Border.module.css';
import styles from 'src/features/output-box/OutputBox.module.css';

const OutputBox = ({ output, output_box_ref }) => {
  return (
    <div
      className={`${styles.Container} ${border.Border}`}
      data-testid="output-box"
      aria-label="Output"
      ref={output_box_ref}
      tabIndex={0}>
      {output.text}
    </div>
  );
};

export default OutputBox;
