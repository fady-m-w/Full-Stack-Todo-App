import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import type { ReactNode } from "react";

interface Iprops {
  isOpen: boolean;
  closeModel: () => void;
  title?: string;
  children: ReactNode;
}

const Modal = ({ isOpen, closeModel, title, children }: Iprops) => {
  return (
    <>
      <Dialog open={isOpen} onClose={closeModel} className="relative z-50">
        {/* الخلفية */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 backdrop-blur-sm data-closed:opacity-0 duration-300 ease-out"
        />

        {/* المحتوى */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            {title && (
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
            )}

            <div className="mt-4">{children}</div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
