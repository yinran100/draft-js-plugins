import React, { ReactElement } from 'react';
import { EditorState } from 'draft-js';

export interface SideToolbarButtonProps {
  className?: string;
  getTargetKey(): string;
  getEditorState(): EditorState;
  setEditorState(state: EditorState): void;
}

export default function SideToolbarButton({
  className,
}: SideToolbarButtonProps): ReactElement {
  return (
    <div className={className}>
      <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    </div>
  );
}
