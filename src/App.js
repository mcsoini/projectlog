import './App.css';
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react"
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faStackOverflow, faOrcid, faLinkedin } from "@fortawesome/free-brands-svg-icons"

import data from "./data.json";
import { CSSTransition } from 'react-transition-group';

import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSearchParams } from "react-router-dom";

const targetOrderLanguages = ["Python", "Java", "JS/React", "Matlab"]

function FilterComponent({title, techList, techSelect, onSelect}) {

  return !techList ? null : <>
        <div className="filter-wrapper"><div className='filter-title'>{`${title}:`}</div>
        <Dropdown className="mx-1 danger filter-dropdown" 
          id={"dropdown-variants-danger"}
          onSelect={(item) => {
            onSelect(item)
          }}>
        <Dropdown.Toggle id="dropdown-basic" className="filter-button" variant="flat">
          <b>{techSelect ? techSelect : "All"}</b>  
        </Dropdown.Toggle>

        <Dropdown.Menu>

        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Divider />

          {techList.map((tech, i) => 
            <Dropdown.Item key={i} eventKey={tech}>{tech}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      </div>
      </>
}


function ImageOverlayLink({image, caption}) {

  const [popUpOpen, setPopUpOpen] = useState(false);

  return <>
    <div onClick={() => setPopUpOpen(true)}>
      <img className="svg-logo" alt="" 
           src={`${process.env.PUBLIC_URL}/logos/screenshot.svg`} 
           style={{height: "40px"}}/></div>    

      <CSSTransition
        in={popUpOpen}
        timeout={300}
        classNames="overlay"
        unmountOnExit>

    <div onClick={() => setPopUpOpen(false)} className="overlay">
        <div onClick={() => setPopUpOpen(false)} className="overlay-image-container">
        {caption?<h4>{caption}</h4>:null}
        <LazyLoadImage
          className="overlay-image"
          loading="lazy"
          alt=""
          src={`${process.env.PUBLIC_URL}/img/${image}`}/>
      </div>
    </div>

    </CSSTransition>
  </>
}

function defaultListThenOthers(defaultList, targetList) {


  const newList = defaultList.filter(x => targetList.includes(x)
    ).concat(targetList.filter(x => !defaultList.includes(x)))

  return newList
  }

function Project({name, id, noTitle, tldrProject, descriptionProject,
                  descriptionList, img1, sectionkey,
                  repository, docs, altdocs, pip, inViewHandler, techStack, keywords, languages,
                  screenshot, caption, dataSelect}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView, dataSelect]);

  const orderedDescriptionList = defaultListThenOthers(["Context", "Current status", "Data"], Object.keys(descriptionList))

return <>
    <section id={sectionkey} key={sectionkey} ref={ref}>
      {noTitle ? <></> : 
        <h4 style={{color: inView ? "black" : "black"}} ><span dangerouslySetInnerHTML={{ __html: name }}/>{""}
        </h4>}
      <>
        {!tldrProject ? null : <><em dangerouslySetInnerHTML={{ __html: "tl;dr: " + tldrProject}}/><br/></>}
        <div className="description-project" dangerouslySetInnerHTML={{ __html: descriptionProject}}/>
      </>
    <div className="section-content">
    <span className="wrapper-icons">
        {!repository ? null : <a href={`https://github.com/mcsoini/${repository}`}><img className="svg-logo" alt="" src={`${process.env.PUBLIC_URL}/logos/github_new.svg`} style={{height: "40px"}}/></a>}
        {!docs ? null : <a href={`https://${docs}.readthedocs.io/en/latest/`}><img className="svg-logo" alt="" src={`${process.env.PUBLIC_URL}/logos/rtd_new.svg`} style={{height: "40px"}}/></a>}
        {!altdocs ? null : <a href={altdocs}><img className="svg-logo" src={`${process.env.PUBLIC_URL}/logos/rtd_new.svg`} alt="" style={{height: "40px"}}/></a>}
        {!pip ? null : <a href={`https://pypi.org/project/${pip}/`}><img className="svg-logo" alt="" src={`${process.env.PUBLIC_URL}/logos/pypi_new.svg`} style={{height: "40px"}}/></a>}
        {!screenshot ? null : <ImageOverlayLink image={screenshot} caption={<><em>{name}:</em> {caption}</>}/>}
      </span>

    <ul>
      {orderedDescriptionList.map((descriptionName, i) => (
      <li key={i}><b className="description-item-title">{ descriptionName }</b>: <span dangerouslySetInnerHTML={{ __html: descriptionList[descriptionName] }}/> </li>))
    }
    <hr/>
    <li key={9997}><b className="description-item-title">{`Language${languages?.length > 1 ? "s" : ""}`}</b>: {languages?.join(" | ")}</li>
    <li key={9999}><b className="description-item-title">Tech stack</b>: {techStack?.join(" | ")}</li>
    <li key={9998}><b className="description-item-title">{`Keyword${keywords?.length > 1 ? "s" : ""}`}</b>: {keywords?.join(" | ")}</li>
    </ul> 

    <div className="project-image-container">
      <LazyLoadImage alt="" 
                     className={"project-image"} 
                     src={ `${process.env.PUBLIC_URL}/img/${img1}` } key={1} 
      />
      {/* <div className={"project-image-overlay"} /> */}
    </div>
  </div>
  </section>
  </>
}




function ProjectGroup({id, groupName, groupDescription, dataSelect, projects, inViewHandler}) {

  const [ref, inView] = useInView();

  useEffect(() => {
    inViewHandler(id, inView)
  }, [inView, dataSelect]);

  return <>
    <section id={id} ref={ref}>
      <h2>{groupName}</h2>
      
      {!groupDescription ? null : <div className="project-group-description" dangerouslySetInnerHTML={{ __html: groupDescription }}/>}
      {projects.map((proj, i) => 
          <Project name={proj.name}
                  key={i}
                  descriptionProject={proj.descriptionProject}
                  tldrProject={proj.tldrProject}
                  descriptionList={proj.descriptionList}
                  id={proj.projectId}
                  noTitle={projects.length < 2 && !proj.forceProjectTitle}
                  sectionkey={`${id}-${proj.projectId}`}
                  img1={proj.img1}
                  repository={proj.repository}
                  docs={proj.docs}
                  techStack={proj.techStack}
                  altdocs={proj.altdocs}
                  pip={proj.pip}
                  inViewHandler={inViewHandler}
                  screenshot={proj.screenshot}
                  keywords={proj.keywords}
                  caption={proj.caption}
                  languages={proj.languages}
                  dataSelect={dataSelect}/>
      )}
      </section>
      <hr/>
  </>
}

function TitleIcons () {

  return <>
      <span className="wrapper-icons-title">
        <a href={`https://github.com/mcsoini/`}>
          {/* <img className="svg-logo" alt="github logo" src={`${process.env.PUBLIC_URL}/logos/github_new.svg`}/> */}
          <FontAwesomeIcon className="svg-logo" icon={faGithub} />
        </a>
        <a href={`https://www.linkedin.com/in/mcsoini/`}>
          {/* <img className="svg-logo" alt="linkedin logo" src={`${process.env.PUBLIC_URL}/logos/linkedin_new.svg`}/> */}
          <FontAwesomeIcon className="svg-logo" icon={faLinkedin} />
        </a>
        <a href={`https://stackoverflow.com/users/10020283/mcsoini?tab=profile`}>
{/*           <img className="svg-logo" alt="so logo" src={`${process.env.PUBLIC_URL}/logos/so_new.svg`}/>
 */}          <FontAwesomeIcon className="svg-logo" icon={faStackOverflow} />
        </a>
        <a href={`https://orcid.org/0000-0002-8467-7515`} >
{/*           <img className="svg-logo" alt="orcid logo" src={`${process.env.PUBLIC_URL}/logos/orcid_new.svg`}/>
 */}          <FontAwesomeIcon className="svg-logo" icon={faOrcid} />
        </a>
      </span>
</>
}

function App() {

  const [ visibleMap, setVisibleMap ] = useState(new Map())
  const [ isDesktop, setIsDesktop ] = useState(window.innerWidth > 700)
  const [ filterListMap, setFilterListMap ] = useState({})
  const [ filterSelect, setFilterSelect ] = useState({})
  const [ dataSelect, setDataSelect ] = useState(data)
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ parent ] = useAutoAnimate({duration: 500, easing: 'ease-in-out'})  

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 700)
  }

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  })

  function filterData() {

    if (Object.values(filterSelect).every(x => "All" === x | "All")) {
      setDataSelect(data);
      return undefined
    }

    const newDataSelect = []

    data.forEach((group) => {

      const projectsFiltered = group.groupProjects.filter(project => 
          (project.techStack?.includes(filterSelect.techStack) | filterSelect.techStack === "All" | !filterSelect.techStack)
          & (project.keywords?.includes(filterSelect.keywords) | filterSelect.keywords === "All" | !filterSelect.keywords)
          & (project.languages?.includes(filterSelect.languages) | filterSelect.languages === "All" | !filterSelect.languages)
        ).map(project => {

          if (group.groupProjects.length >= 2 | project.forceProjectTitle) {
            project["forceProjectTitle"] = 1;
          }
         return project
        })

      if (projectsFiltered.length > 0) {
        newDataSelect.push({...group, ...{groupProjects: projectsFiltered}})
      }
    })

    setDataSelect(newDataSelect);
    console.log("Done filterData");

  }

  useEffect(() => filterData(), [filterSelect])
  useEffect(() => filterData(), []) 


  useEffect(function resetInView() {
    setVisibleMap(Object.fromEntries(Object.keys(visibleMap).map(x => [x, false])))
  }, [dataSelect])

  const filterListList = ["techStack", "keywords", "languages"]

  function resetFilter() {
    setSearchParams({});
    setFilterSelect({});
  }

  function initFilterSelect() {
    setFilterSelect(Object.fromEntries(filterListList.map(x => [x, searchParams.get(x) || "All" ])))
  }

  useEffect(initFilterSelect, [])

  useEffect(function initFilterLists() {

    const newFilterListMap = Object.fromEntries(filterListList.map((filterListName) => {

      const newList = new Set()
     // const thisData = (!dataSelect | filterSelect[filterListName] != "All") ? data : dataSelect 

      data.forEach((group) => {
        group.groupProjects.forEach(project => {
          project[filterListName]?.forEach(item => newList.add(item))
        })
      })
      return [filterListName, Array.from([...newList].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())))]
    }))

    newFilterListMap["languages"] = defaultListThenOthers(targetOrderLanguages,
                                                          newFilterListMap["languages"])
    setFilterListMap(newFilterListMap)

  }, [])


  const inViewHandler = (name, isVisible) => {
    setVisibleMap({...visibleMap, ...Object.fromEntries([[name, isVisible]])});
  }

  const onFilterSelect = (filterName, filterValue) => {
    const newEntry = Object.fromEntries([[filterName, filterValue]]);
    setSearchParams(newEntry);
    setFilterSelect(newEntry);
  }

  return (
    <div className="App">{
    <>
    <div key="0" className="filter-bar">

    {!Object.values(filterSelect).some(select => (select !== "All") & (select !== null)) ? null : 
        <Button key="0" className="filter-button" onClick={resetFilter}>{"Reset filter =>"}</Button>}
    <FilterComponent key="1" title="Language" techList={filterListMap.languages}
                     techSelect={filterSelect.languages} 
                     onSelect={(x) => onFilterSelect("languages", x)}/>
    <FilterComponent key="2" title="Tech" techList={filterListMap.techStack}
                     techSelect={filterSelect.techStack}  
                     onSelect={(x) => onFilterSelect("techStack", x)}/>
    <FilterComponent key="3" title="Keywords" techList={filterListMap.keywords}
                     techSelect={filterSelect.keywords}   
                     onSelect={(x) => onFilterSelect("keywords", x)}/>
    </div>

    <nav key="1" className="section-nav">

    <div key="2" className="navtitle">
      {isDesktop ? <>
          <h1 style={{fontSize: "xx-large", textAlign: "center"}}>@mcsoini</h1>
          <TitleIcons/>
          <h2 style={{textAlign: "center"}}>Project log</h2>
          </> : 
          <h1 style={{fontSize: "xx-large", textAlign: "center"}}>@mcsoini | Project log</h1>
      }
    </div>

    <div key="3" className="ol-container">
    <ol ref={parent}>
    {dataSelect.map((group, i) => {return group.skip ? null :
    <li><a key={i} href={`#${group.groupId}`} 
           style={{color: visibleMap[group.groupId] ? "black" : "#aaa",
                   borderLeft: visibleMap[group.groupId] ? "black 2px solid" : "#0000 2px solid",
                   fontWeight: visibleMap[group.groupId] ? "normal" : "normal"}}>{group.groupName}
        </a>                 
    <ul>
    {group.groupProjects.map((proj, i) => {
      return (group.groupProjects.length < 2) && (!proj.forceProjectTitle) ? null :
       <li key={i} className="section-nav-proj-item"><a href={`#${group.groupId}-${proj.projectId}`} style={{
            color: visibleMap[proj.projectId] ? "black" : "#aaa",
            borderLeft: visibleMap[proj.projectId] ? "black 2px solid" : "#0000 2px solid",
          }}>{proj.nameShort ? proj.nameShort : proj.name}</a></li>
    })}
    </ul>
    </li>}
    )}
    </ol>
    </div>

</nav>


<div className="FixedHeightContainer">
<div className="Content">

      {dataSelect.map((group) => {return group.skip ? null : <>
        <ProjectGroup id={group.groupId}
                      groupName={group.groupName}
                      groupDescription={group.groupDescription}
                      projects={group.groupProjects}
                      dataSelect={dataSelect}
                      inViewHandler={inViewHandler}
                      /></>})}
    </div>
    </div>
  


    </>}
    </div>
);
}

export default App;
