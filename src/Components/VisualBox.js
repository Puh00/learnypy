import { graphviz } from 'd3-graphviz';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

import generate_dot from '../util/dotGenerator';
import set_text from '../util/textGenerator';
import border from './Border.module.css';
import { ReactComponent as Zoom_logo } from './Icons/magnifying-glass.svg';
import styles from './VisualBox.module.css';

const VisualBox = ({ data, share_methods }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });
  const [ariaLabel, setAriaLabel] = useState('');
  const [zoomedIn, setZoomedIn] = useState(false);
  const container = useRef(null);

  const resetGraphZoom = () => {
    graphviz(`#graph-body`).resetZoom();
    setZoomedIn(false);
  };

  const resetZoomButton = (disabled) => {
    const tooltip_text = `Reset zoom and panning ${disabled ? '(disabled)' : ''}`;

    return (
      <Button
        className={styles.Button}
        variant="light"
        onClick={resetGraphZoom}
        data-toggle="tooltip"
        title={tooltip_text}
        aria-label={tooltip_text}
        disabled={disabled}>
        <Zoom_logo />
      </Button>
    );
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

        // remove title tebeenxts from all <title> tags, to prevent tooltips
        // after the graph has been rendered, this is a kinda scuffed...
        removeTitle(container.current.childNodes[0]);
      });
  }, []);

  return (
    <div className={`${styles.Container} ${border.Border}`} tabIndex={0} aria-label={ariaLabel}>
      <div ref={container} id="graph-body"></div>
      {resetZoomButton(!zoomedIn)}
    </div>
  );
};

export default VisualBox;
