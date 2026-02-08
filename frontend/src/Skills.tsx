import { useEffect, useState } from 'react'
import './Skills.css'
import { Link } from 'react-router-dom';

function Skills() {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from /api/skills");
        const res = await fetch("/api/skills");
        const data = await res.json();
        setSkills(data);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
console.log('use effect')
    fetchData();
  }, []); // end of useEffect

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div>
    <h1>Skills List</h1>
    <ul style={{listStyle: 'none'}}>
      {skills.map((skill, index) => 
        <li key={index}>          
          <Link to={`/jobs/${encodeURIComponent(skill[0])}`}>
            {skill[0]} - {skill[1]}
          </Link>
          
        </li>
      )}
    </ul>
  </div>);
}

export default Skills
