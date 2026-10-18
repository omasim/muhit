import {useEffect,useRef} from 'react';
import type {IconOptions} from 'muhit-ui/icons';
type IconSource={mount(host:Element,options?:IconOptions):{destroy():void}};
export function MuhitIcon({icon,size=24,stroke,label,dir}:IconOptions & {icon:IconSource}) {
  const host=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    if(!host.current)return;
    const instance=icon.mount(host.current,{size,stroke,label,dir});
    return ()=>instance.destroy();
  },[icon,size,stroke,label,dir]);
  return <span ref={host} className="mh-icon-host" />;
}
