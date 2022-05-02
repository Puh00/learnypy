import React, { useEffect, useRef, useState } from 'react';
import { graphviz } from 'd3-graphviz';

import { ReactComponent as Reset_zoom_logo } from 'src/assets/reset.svg';
import Button from 'src/components/Button';
import border from 'src/features/Border.module.css';
import set_text from 'src/features/visual-box//textGenerator';
import styles from 'src/features/visual-box//VisualBox.module.css';
import generate_dot from 'src/features/visual-box/dotGenerator';

const VisualBox = ({ data, share_methods }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });
  const [ariaLabel, setAriaLabel] = useState('');
  const [zoomedIn, setZoomedIn] = useState(false);
  const container = useRef(null);

  const resetGraphZoom = () => {
    graphviz(`#graph-body`).resetZoom();
    setZoomedIn(false);
  };

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
    setAriaLabel(set_text(data.objects, data.variables));
  }, [data]);

  useEffect(() => {
    graphviz(`#graph-body`)
      .attributer((d) => {
        if (d.tag === 'svg') {
          // hide the generated svg file from screen readers
          d.attributes['aria-hidden'] = true;
          return;
        }
      })
      .renderDot(graph.dot);
  }, [graph]);

  useEffect(() => {
    const removeTitle = (ele) => {
      if (ele.tagName === 'title') {
        ele.innerHTML = '';
        return;
      }

      ele.childNodes.forEach((node) => {
        removeTitle(node);
      });
    };

    graphviz(`#graph-body`)
      .on('initEnd', () => {
        share_methods({
          resetGraphZoom: resetGraphZoom
        });
      })
      .on('end', () => {
        // after the graph has been rendered, attach a zoom event listener,
        // do not put this in 'initEnd' event even if it might feel more intuitive,
        // crazy stuff happens
        graphviz(`#graph-body`)
          .zoomBehavior()
          .on('zoom.setZoomed', (event) => {
            if (event.sourceEvent && !zoomedIn) {
              // zoom caused by a user
              setZoomedIn(true);
            }
          });

        // remove title texts from all <title> tags, to prevent tooltips
        // after the graph has been rendered, this is a kinda scuffed...
        removeTitle(container.current.childNodes[0]);
      });
  }, []);

  return (
    <div className={`${styles.Container} ${border.Border}`} aria-label={ariaLabel}>
      <div ref={container} id="graph-body" title="Graph"></div>
      <Button
        className={styles.Button}
        onClick={resetGraphZoom}
        logo={<Reset_zoom_logo />}
        tooltip="Reset zoom and panning"
        disabled={!zoomedIn}
      />
    </div>
  );
};

export default VisualBox;
