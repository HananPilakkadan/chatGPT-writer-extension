import React from "react"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}>
      <div
        className="bg-white p-5 rounded shadow-lg max-w-4xl w-full relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-0 right-0 m-4 text-gray-700"
          onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
