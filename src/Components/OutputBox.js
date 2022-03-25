import React from 'react';

const Output_box = ({ output, output_box_ref }) => {
  return (
    <div
      className="Output-box"
      data-testid="output-box"
      aria-label="Output"
      ref={output_box_ref}
      tabIndex={0}>
      {output.text}
    </div>
  );
};

export default Output_box;
