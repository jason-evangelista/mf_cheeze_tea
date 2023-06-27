import { IconX } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';

export type ModalProps = {
  isOpen: boolean;
  title: string;
  handleToggle: () => void;
} & PropsWithChildren;

const Modal = ({ isOpen, children, handleToggle, title }: ModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed w-full top-0 left-0 right-0 h-screen flex justify-center bg-[rgba(0,0,0,.2)] overflow-hidden overflow-y-auto">
          <div className="w-full h-max mx-4 md:w-[35%] bg-white shadow-md rounded-sm p-3 my-12 z-10">
            <div className="flex w-full justify-between">
              <h1>{title}</h1>
              <button onClick={handleToggle}>
                <IconX size={18} />
              </button>
            </div>
            <hr className="my-2" />
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
