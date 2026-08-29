"use client"

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EditPageSkeleton from "@/skeletons/EditPageSkeleton";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
export default function EditPage(){
     const [title, setTitle] = useState("");
  const [except, setExcept] = useState("");
  const [coverImage, setCoverImage] = useState<null | File>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
   const editor = useRef(null);
    const [content, setContent] = useState("");
      const [loading, setLoading] = useState(true);
      const router= useRouter();
      const {postId}=useParams();

    const config= useMemo(()=>({
        placeholder:"start writing your article...",
        theme:"dark",
        style:{backround:"#121212",
            color:"#d1d5dc"
        }
    }),[]);
    const handleSubmit= async(e:React.FormEvent)=>{
        e.preventDefault();
       try{
        if (!title || !except || !content) {
        toast("Title, Except and Content are required!", {
          style: {
            color: "white",
            background: "#1e3a8a",
          },
        });
        return;
      }
         setIsSubmitting(true);

         const formData = new FormData();
      formData.append("title", title);
      formData.append("except", except);
      formData.append("content", content);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

       const response=await axios.patch(`/api/posts/${postId}`, formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
       })
       toast("Article updated successfully", {
        style: {
          color: "white",
          background: "#1e3a8a",
        },
      });

       const slug = response.data.slug
       router.replace(`/articles/${slug}`)
       }catch(error){
         if (axios.isAxiosError(error)) {
        //toast to the user about the error

        toast(error.response?.data.error, {
          style: {
            color: "white",
            background: "#1e3a8a",
          },
        });
      }
       }
    }
    useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${postId}`);

        setTitle(data.title);
        setContent(data.content);
        setExcept(data.except);
        setPreviewImage(data.coverImageURL);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("AXIOS_ERROR:", error.response?.data);
          alert(error.response?.data?.error || "Failed to load post");
        } else {
          console.error("UNKNOWN_ERROR:", error);
          alert("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);
 if (loading) return <EditPageSkeleton />;
    return(
        <section className="max-w-3xl mx-auto py-20 px-6">
          <h1>Edit Your Article</h1>
          <form onSubmit={handleSubmit}>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="Article title" className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-500 outline-none mb-6"/>

            <textarea value={except} onChange={(e)=>setExcept(e.target.value)} placeholder="write a short except (1-2 sentences) " rows={3} className="w-full bg-black/70 text-gray-200 placeholder-gray-500 rounded-xl p-4 mb-8 outline-none resize-none border border-white/10 focus:border-orange-500/50"/>
              <div className="mb-10">
          <label className="block text-gray-400 mb-2">Cover Image</label>
          <input
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full
            file:border-0
            file:bg-primary
            file:text-white
            hover:file:bg-indigo-500"
          />
        </div>

         <div className="my-8">
          <Image
            src={previewImage}
            alt="image-preview"
            width={300}
            height={300}
            className="object-cover"
          />
        </div>

         <div className="rounded-2xl overflow-hidden border border-white/10 mb-10">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
          <div className="flex justify-end">
          <button className="px-6 py-3 rounded-full bg-primary cursor-pointer text-white font-semibold transition-colors">
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
          </form>
        </section>    
    )
}