import React from 'react';

import './OutputBox.css';

const OutputBox = ({ output, output_box_ref }) => {
  return (
    <div
      className="Output-box Border"
      data-testid="output-box"
      aria-label="Output"
      ref={output_box_ref}
      tabIndex={0}>
      {output.text}
    </div>
  );
};

export default OutputBox;
