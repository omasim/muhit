import {useId,type ReactNode} from 'react';
import 'muhit-ui/styles/pages.css';
export type MuhitPageProps={title:string;description?:string;children:ReactNode;navigation?:ReactNode;actions?:ReactNode;aside?:ReactNode;width?:'reading'|'standard'|'wide'|'fluid';skipLabel?:string;navigationLabel?:string};
export function MuhitPage({title,description,children,navigation,actions,aside,width='standard',skipLabel='Skip to content',navigationLabel='Navigation'}:MuhitPageProps){
  const id=useId();
  return <div className="mh-scope"><a className="mh-skip" href={'#'+id}>{skipLabel}</a><div className={"mh-shell"+(navigation?"":" mh-shell--plain")}>
    {navigation&&<aside className="mh-shell__nav"><nav aria-label={navigationLabel}>{navigation}</nav></aside>}
    <div className="mh-shell__body"><main id={id} tabIndex={-1} className="mh-content" data-width={width}>
      <header className="mh-content__header"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{actions}</header>
      <div className="mh-region-grid"><section className={'mh-region mh-region--'+(aside?'main':'full')}>{children}</section>{aside&&<aside className="mh-region mh-region--rail">{aside}</aside>}</div>
    </main></div></div></div>;
}
