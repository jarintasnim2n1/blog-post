import React from 'react'
import { LuX } from 'react-icons/lu';
interface ModalProps{
    isOpen:boolean;
    onClose:()=>void;
    children:React.ReactNode;
}
const Modal = ({ onClose, isOpen, children }: ModalProps) => {
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl bg-[#121212] border border-white/10 px-6 py-10 shadow-2xl transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition cursor-pointer"
          aria-label="Close Modal"
          onClick={onClose}
        >
          <LuX size={22} />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal