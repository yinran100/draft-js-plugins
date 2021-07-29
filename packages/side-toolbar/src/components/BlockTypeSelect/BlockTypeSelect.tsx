import { EditorState } from 'draft-js';
import { DraftJsButtonTheme } from '@draft-js-plugins/buttons';
import { usePopper } from 'react-popper';
import _throttle from 'lodash/throttle';
import React, {
  FC,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SideToolbarPluginTheme } from '../../theme';
import { PopperOptions } from '../..';

export interface BlockTypeSelectChildProps {
  theme: DraftJsButtonTheme;
  setVisible(visible: boolean): void;
  getTargetKey(): string;
  getEditorState(): EditorState;
  setEditorState(state: EditorState): void;
}

export interface CreateBlockTypeSelectPopperOptionsFn {
  (arrowElement: HTMLElement | null): PopperOptions;
}

interface BlockTypeSelectProps {
  theme: SideToolbarPluginTheme;
  getEditorState(): EditorState;
  setEditorState(state: EditorState): void;
  getTargetKey(): string;
  childNodes: FC<BlockTypeSelectChildProps>;
  referenceElement: HTMLElement | null;
  rootReferenceElement: HTMLElement | null;
  show: boolean;
  createBlockTypeSelectPopperOptions?: CreateBlockTypeSelectPopperOptionsFn;
}

function createDefaultPopperOptions(
  arrowElement: HTMLElement | null
): PopperOptions {
  return {
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'offset',
        options: {
          offset: [-4, -4],
        },
      },
    ],
  };
}

export default function BlockTypeSelect({
  theme,
  getEditorState,
  setEditorState,
  childNodes,
  referenceElement,
  show,
  getTargetKey,
  rootReferenceElement,
  createBlockTypeSelectPopperOptions = createDefaultPopperOptions,
}: BlockTypeSelectProps): ReactElement {
  const onMouseDown = useCallback((clickEvent: MouseEvent) => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
  }, []);

  const [visible, _setVisible] = useState(false);
  const setVisible = useCallback(_throttle(_setVisible, 100), []);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const popperOptions = useMemo(
    () => createBlockTypeSelectPopperOptions(arrowElement),
    [arrowElement, createBlockTypeSelectPopperOptions]
  );
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    popperOptions
  );

  useEffect(() => {
    update?.();
  }, [rootReferenceElement, update]);

  const onMouseEnter = useCallback(
    (e) => {
      if (referenceElement?.contains(e.nativeEvent.fromElement))
        setVisible(true);
    },
    [referenceElement]
  );
  return (
    <div
      className={theme.blockTypeSelectStyles?.popup}
      ref={setPopperElement}
      style={styles.popper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setVisible(false)}
      {...attributes.popper}
      data-show={show || visible}
      onMouseDown={onMouseDown}
    >
      <div className={theme.blockTypeSelectStyles?.popupFrame}>
        {childNodes({
          getEditorState,
          setEditorState,
          setVisible,
          getTargetKey,
          theme: theme.buttonStyles!,
        })}
        <div
          ref={setArrowElement}
          style={styles.arrow}
          className={theme.blockTypeSelectStyles?.arrow}
          {...attributes.popper}
        />
      </div>
    </div>
  );
}
