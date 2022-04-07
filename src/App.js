import logo from './logo.svg';
import './App.css';
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react"
import ReactTooltip from 'react-tooltip';

import data from "./data.json";


function Project({name, id, descriptionProject, descriptionList, img1, sectionkey, repository, docs, pip, inViewHandler}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView]);

  return <>
    <section id={sectionkey} key={sectionkey} ref={ref}>
      <h3 style={{color: inView ? "black" : "black"}} ><u dangerouslySetInnerHTML={{ __html: name }}/>{": "}
          <span dangerouslySetInnerHTML={{ __html: descriptionProject}}/>
      </h3>
    <div className="section-content">

    <ul>
      {Object.entries(descriptionList).map((entry, i) => (
      <li key={i}><b>{ entry[0] }</b>: <span dangerouslySetInnerHTML={{ __html: entry[1] }}/> </li>))
    }
      <li>
      <a href={`https://github.com/mcsoini/${repository}`} target={"_blank"}><img src={"./logos/github.svg"} style={{height: "40px"}}/></a>
      {!docs ? null : <a href={`https://${docs}.readthedocs.io/en/latest/`} target={"_blank"}><img src={"./logos/rtd.svg"} style={{height: "40px"}}/></a>}
      {!docs ? null : <a href={`https://pypi.org/project/${pip}/`} target={"_blank"}><img src={"./logos/pypi.svg"} style={{height: "40px"}}/></a>}
      </li>
    </ul> 

    <div style={{position: "relative", display: "flex", width: "100%", flexDirection: "row"}}>
      <img className={"project-image"} src={ img1 } alt="" key={1} />
      <div className={"project-image-overlay"} />
    </div>
  </div>
  </section>
  </>
}




function ProjectGroup({id, groupName, projects, inViewHandler}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView]);

  return <>
    <section id={id} ref={ref}>
      <h2>{groupName}</h2>

      {projects.map((proj) => 
          <Project name={proj.name}
                  descriptionProject={proj.descriptionProject}
                  descriptionList={proj.descriptionList}
                  id={proj.projectId}
                  sectionkey={`${id}--${proj.projectId}`}
                  img1={proj.img1}
                  repository={proj.repository}
                  docs={proj.docs}
                  pip={proj.pip}
                  inViewHandler={inViewHandler}/>
      )}
      </section>
      <hr/>
  </>
}




function App() {

  const [ visibleMap, setVisibleMap ] = useState(new Object())

  useEffect(function initVisibleMap() {
    const newVisibleMap = new Map();
    /* data.forEach((group) => {
      visibleMap[group.groupId] = false;
      group.groupProjects.forEach((proj) => {
        visibleMap[proj.projectId] = false;
      })
    }) */
    setVisibleMap(newVisibleMap); 
  }, [])

  

  const group = data[0]
  const inViewHandler = (name, isVisible) => {
    setVisibleMap({...visibleMap, ...Object.fromEntries([[name, isVisible]])});
  }


  return (
    <div className="App">

    <div>

  {data.map((group) => <>
    <ProjectGroup id={group.groupId}
                  groupName={group.groupName}
                  projects={group.groupProjects}
                  inViewHandler={inViewHandler}/>
  </>
  )}


  </div>

      <nav className="section-nav">

        <h1 style={{fontSize: "xx-large", textAlign: "center"}}>@mcsoini</h1>
        <h2 style={{textAlign: "center"}} data-tip="Contrary to popular belief, this is not a malfunctioning 404 page."><em>Project log</em></h2>
        <ReactTooltip place="top" type="error" effect="float"/>
        
      <ol>
      {data.map(group => 
        <li><a href={`#${group.groupId}`} 
               style={{color: visibleMap[group.groupId] ? "black" : "#ccc",
                       fontWeight: visibleMap[group.groupId] ? "bolder" : "normal"}}>{group.groupName}</a>
        <ul>
        {group.groupProjects.map(proj => 
          <li className=""><a href={`#${group.groupId}--${proj.projectId}`} style={{color: visibleMap[proj.projectId] ? "black" : "#ccc"}}>{proj.name.replace(" (work in progress)", "")}</a></li>
          )}
        </ul>
        </li>
      )}
      </ol>

    </nav>

    
    </div>
  );
}

export default App;
