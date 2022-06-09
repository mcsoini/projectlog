import './App.css';
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react"

import data from "./data.json";
import { CSSTransition } from 'react-transition-group';


function ImageOverlayLink({image, caption}) {

  const [popUpOpen, setPopUpOpen] = useState(false);

  return <>
    <div onClick={() => setPopUpOpen(true)}><img alt="" src={"./logos/image.png"} style={{height: "40px", backgroundColor: "white"}}/></div>    
    <CSSTransition
        in={popUpOpen}
        timeout={300}
        classNames="overlay"
        unmountOnExit
    >

    <div onClick={() => setPopUpOpen(false)} className="overlay">
        <div onClick={() => setPopUpOpen(false)} className="overlay-image-container">
        {caption?<h4>{caption}</h4>:null}
        <img className="overlay-image" alt="" src={image}/>
      </div>
    </div>

    </CSSTransition>
  </>
}




function Project({name, id, noTitle, descriptionProject,
                  descriptionList, img1, sectionkey,
                  repository, docs, altdocs, pip, inViewHandler,
                  screenshot, caption}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView]);

  return <>
    <section id={sectionkey} key={sectionkey} ref={ref}>
      {noTitle ? <></> : 
      <h4 style={{color: inView ? "black" : "black"}} ><span dangerouslySetInnerHTML={{ __html: name }}/>{""}
      </h4>}
      <span dangerouslySetInnerHTML={{ __html: descriptionProject}}/>
    <div className="section-content">

    <span className="icon-wrapper">
        {!repository ? null : <a href={`https://github.com/mcsoini/${repository}`}><img alt="" src={`${process.env.PUBLIC_URL}/logos/github_new.svg`} style={{height: "40px"}}/></a>}
        {!docs ? null : <a href={`https://${docs}.readthedocs.io/en/latest/`}><img alt="" src={`${process.env.PUBLIC_URL}/logos/rtd_new.svg`} style={{height: "40px"}}/></a>}
        {!altdocs ? null : <a href={altdocs}><img src={`${process.env.PUBLIC_URL}/logos/rtd_new.svg`} alt="" style={{height: "40px"}}/></a>}
        {!pip ? null : <a href={`https://pypi.org/project/${pip}/`}><img alt="" src={`${process.env.PUBLIC_URL}/logos/pypi_new.svg`} style={{height: "40px"}}/></a>}
        {!screenshot ? null : <ImageOverlayLink image={screenshot} caption={<><em>{name}:</em> {caption}</>}/>}
      </span>

    <ul>
      {Object.entries(descriptionList).map((entry, i) => (
      <li key={i}><b>{ entry[0] }</b>: <span dangerouslySetInnerHTML={{ __html: entry[1] }}/> </li>))
    }

    </ul> 

    <div className="project-image-container">
      <img alt="" className={"project-image"} src={ `${process.env.PUBLIC_URL}/img/${img1}` } key={1} />
      {/* <div className={"project-image-overlay"} /> */}
    </div>
  </div>
  </section>
  </>
}




function ProjectGroup({id, groupName, groupDescription, projects, inViewHandler}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView]);

  return <>
    <section id={id} ref={ref}>
      <h2>{groupName}</h2>
      <span dangerouslySetInnerHTML={{ __html: groupDescription }}/>
      {projects.map((proj) => 
          <Project name={proj.name}
                  descriptionProject={proj.descriptionProject}
                  descriptionList={proj.descriptionList}
                  id={proj.projectId}
                  noTitle={projects.length < 2 && !proj.forceProjectTitle}
                  sectionkey={`${id}--${proj.projectId}`}
                  img1={proj.img1}
                  repository={proj.repository}
                  docs={proj.docs}
                  altdocs={proj.altdocs}
                  pip={proj.pip}
                  inViewHandler={inViewHandler}
                  screenshot={proj.screenshot}
                  caption={proj.caption}/>
      )}
      </section>
      <hr/>
  </>
}

function TitleIcons () {

  return <>
      <span className="icon-wrapper-title">
        <a href={`https://github.com/mcsoini/`}><img alt="github logo" src={`${process.env.PUBLIC_URL}/logos/github_new.svg`}/></a>
        <a href={`https://www.linkedin.com/in/mcsoini/`}><img alt="linkedin logo" src={`${process.env.PUBLIC_URL}/logos/linkedin_new.svg`}/></a>
        <a href={`https://stackoverflow.com/users/10020283/mcsoini?tab=profile`}><img alt="so logo" src={`${process.env.PUBLIC_URL}/logos/so_new.svg`}/></a>
        <a href={`https://orcid.org/0000-0002-8467-7515`}><img alt="orcid logo" src={`${process.env.PUBLIC_URL}/logos/orcid_new.svg`}/></a>
      </span>
</>
}


function App() {

  const [ visibleMap, setVisibleMap ] = useState({})
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700)

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 700)
  }

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  })

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

  

  const inViewHandler = (name, isVisible) => {
    setVisibleMap({...visibleMap, ...Object.fromEntries([[name, isVisible]])});
  }


  return (
    <div className="App">
    <nav className="section-nav">

    <div className="navtitle">
      {isDesktop   ? <>
          <h1 style={{fontSize: "xx-large", textAlign: "center"}}>@mcsoini</h1>
          <TitleIcons/>
          <h2 style={{textAlign: "center"}}>Project log</h2>
          </> : 
          <h1 style={{fontSize: "xx-large", textAlign: "center"}}>@mcsoini | Project log</h1>
      }
    </div>

      <div className="ol-container">
    <ol>
    {data.map(group => {return group.skip ? null :
    <li><a href={`#${group.groupId}`} 
          style={{color: visibleMap[group.groupId] ? "black" : "#ccc",
          /*         background: visibleMap[group.groupId] ? "rgb(193, 207, 0)" : "white", */
                  borderLeft: visibleMap[group.groupId] ? "black 2px solid" : "white 2px solid",
                  fontWeight: visibleMap[group.groupId] ? "normal" : "normal"}}>{group.groupName}</a>                 
    <ul>
    {group.groupProjects.map(proj => {return (group.groupProjects.length < 2) && (!proj.forceProjectTitle) ? null :
       <li className="section-nav-proj-item"><a href={`#${group.groupId}--${proj.projectId}`} style={{
            color: visibleMap[proj.projectId] ? "black" : "#ccc",
            /* background: visibleMap[proj.projectId] ? "rgb(193, 207, 0)" : "white", */
            borderLeft: visibleMap[proj.projectId] ? "black 2px solid" : "white 2px solid",
          }}>{proj.name.replace(" (work in progress)", "")}</a></li>
    })}
    </ul>
    </li>}
    )}
    </ol>
    </div>

</nav>
    <div className="content-container">

  {data.map((group) => {return group.skip ? null : <>
    <ProjectGroup id={group.groupId}
                  groupName={group.groupName}
                  groupDescription={group.groupDescription}
                  projects={group.groupProjects}
                  inViewHandler={inViewHandler}/>
  </>}
  )}


  </div>


    
    </div>
  );
}

export default App;
