"use client"
import React from 'react'
import Modal from './Modal';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import { useModalStore } from '@/store/useModalStore';


const SignInModal = () => {
  const { isSignInOpen, closeSignIn } = useModalStore();
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  }

  const signInWithGithub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
    }
  }

  return (
    <Modal onClose={closeSignIn} isOpen={isSignInOpen}>
      <h2 className='text-xl font-semibold text-white mb-2'>Sign In to TechBlog</h2>
      <p className='text-sm text-gray-400 mb-8'>
        Continue with one of the providers below
      </p>
      <div className="space-y-3">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-full cursor-pointer bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>
        <button
          onClick={signInWithGithub}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-full cursor-pointer bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          <FaGithub className="text-xl" /> Continue with GitHub
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-8 text-center">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </Modal>
  )
}

export default SignInModal