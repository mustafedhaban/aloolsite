"use client";
import { FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
type Errors=Partial<Record<"name"|"email"|"message",string>>;
const subscribe=()=>()=>{};
export function ContactForm({enabled=false}:{enabled?:boolean}){
  const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
  const [errors,setErrors]=useState<Errors>({});
  const [checked,setChecked]=useState(false);
  const [busy,setBusy]=useState(false);
  const [failure,setFailure]=useState("");
  const status=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(checked)status.current?.focus();},[checked]);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;const data=new FormData(form);const next:Errors={};
    if(String(data.get("name")||"").trim().length<2)next.name="Please enter at least two characters for your name.";
    if(!/^\S+@\S+\.\S+$/.test(String(data.get("email")||"").trim()))next.email="Enter a valid email address.";
    if(String(data.get("message")||"").trim().length<20)next.message="Please share at least 20 characters of context.";
    setErrors(next);
    const first=Object.keys(next)[0];
    if(first)form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    else if(!enabled)setChecked(true);
    else {
      setBusy(true);setFailure("");
      try {
        const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:data.get("name"),email:data.get("email"),organization:data.get("organization"),projectType:data.get("project-type"),projectStage:data.get("project-stage"),message:data.get("message"),website:data.get("website")})});
        const result=await response.json();
        if(!response.ok)throw new Error(result.error||"We could not save your inquiry.");
        setChecked(true);
      }catch(error){setFailure(error instanceof Error?error.message:"We could not save your inquiry. Please try again.");}
      finally{setBusy(false);}
    }
  }
  if(checked)return <div ref={status} tabIndex={-1} className="form-success" role="status"><h2>{enabled?"Inquiry received.":"Details checked. Not sent."}</h2><p>{enabled?"Your inquiry has been saved for Alool to review. Keep a copy of the details for your own records.":"Your inquiry passed the form checks in this browser. Delivery is not enabled, so Alool has not received it."}</p><button className="text-button" onClick={()=>setChecked(false)}>{enabled?"Start another inquiry":"Start another preview"}</button></div>;
  return <form className="contact-form" noValidate onSubmit={submit}>
    <p className="form-note">Name, work email, and project context are required. Other fields are optional.</p>
    <div hidden aria-hidden="true"><label htmlFor="website">Leave this empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <Field id="name" label="Your name (required)" error={errors.name}><input id="name" name="name" required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name?"name-error":undefined}/></Field>
    <Field id="email" label="Work email (required)" error={errors.email}><input id="email" name="email" required type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email?"email-error":undefined}/></Field>
    <Field id="organization" label="Organization (optional)"><input id="organization" name="organization" autoComplete="organization"/></Field>
    <Field id="project-type" label="Project type (optional)"><select id="project-type" name="project-type"><option>Not sure yet</option><option>Custom software</option><option>Business systems</option><option>Digital experiences</option><option>Technology consulting</option></select></Field>
    <Field id="project-stage" label="Project stage (optional)"><select id="project-stage" name="project-stage"><option>Not sure yet</option><option>Exploring the problem</option><option>Defining requirements</option><option>Ready to build</option><option>Improving an existing system</option></select></Field>
    <Field id="message" label="What are you working on? (required)" error={errors.message}><textarea id="message" name="message" required minLength={20} rows={6} aria-invalid={!!errors.message} aria-describedby={errors.message?"message-error message-help":"message-help"}/><small id="message-help">At least 20 characters. Do not include confidential or sensitive information.</small></Field>
    <button className="button button-green" type="submit" disabled={!ready||busy}>{busy?"Saving…":enabled?"Send inquiry":"Check inquiry details"} <span aria-hidden="true">↗</span></button>
    {failure&&<p role="alert" className="field-error">{failure}</p>}
    <p className="form-note">{enabled?"Your details will be used to review and respond to this inquiry.":"Preview only: this checks your details locally and does not send an inquiry."}</p>
    <noscript><p>JavaScript is needed to use this inquiry form.</p></noscript>
  </form>;
}
function Field({id,label,error,children}:{id:string;label:string;error?:string;children:React.ReactNode}){
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{error&&<span className="field-error" id={`${id}-error`} role="alert">{error}</span>}</div>;
}
