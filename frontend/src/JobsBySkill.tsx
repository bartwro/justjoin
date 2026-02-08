import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

function JobsBySkill() {
    // in App.tsx there is <Route path="/jobs/:skillName" element={<JobsBySkill />} />
    const {skillName} = useParams();
    const [allJobs, setAllJobs] = useState([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/jobs/${encodeURIComponent(skillName || '')}`);
            const jobsBySkill = await res.json(); // todo, res.jobs, res.cities
            setAllJobs(jobsBySkill);
            
            const jobCities = new Map<string, number>();
            for(const job of jobsBySkill) {
                if (jobCities.has(job.city)) {
                    jobCities.set(job.city, (jobCities.get(job.city) ?? 0) + 1)
                } else {
                    jobCities.set(job.city, 1)
                }
            };
            console.dir(jobCities);

            setCities([...jobCities.keys()]);
        };
        fetchData();
    }
    ,[skillName]);

    // reset selection when available cities change (optional)
    useEffect(() => {
        setSelectedCities(new Set());
    }, [cities]);

    const filteredJobs = useMemo(() => {
        if (!selectedCities || selectedCities.size === 0) return allJobs;
        return allJobs.filter((j: any) => selectedCities.has(j.city));
    }, [allJobs, selectedCities]);

    const sortBySalary = () => {
        allJobs.sort((a: any, b: any) => {
            if (a.salary_permanent && b.salary_permanent) {
                if (a.salary_permanent.from < b.salary_permanent.from) return 1;
                if (a.salary_permanent.from > b.salary_permanent.from) return -1;
                else return 0;
            }else if (a.salary_b2b && b.salary_b2b) {
                if (a.salary_b2b.from < b.salary_b2b.from) return 1;
                if (a.salary_b2b.from > b.salary_b2b.from) return -1;
                else return 0;
            } else if (a.salary_permanent && b.salary_b2b) {
                if (a.salary_permanent.from < b.salary_b2b.from) return 1;
                if (a.salary_permanent.from > b.salary_b2b.from) return -1;
                else return 0;
            } else if (a.salary_b2b && b.salary_permanent) {

                if (a.salary_b2b.from < b.salary_permanent.from) return 1;
                if (a.salary_b2b.from > b.salary_permanent.from) return -1;
                else return 0;
            } else if (!a.salary_permanent && !a.salary_b2b) {
                if (b.salary_permanent || b.salary_b2b) {
                    return 1;
                }
            } else if (!b.salary_permanent && !b.salary_b2b) {
                if (a.salary_permanent || a.salary_b2b) {
                    return -1;
                }
            }
            return 0;
        });
        setAllJobs([...allJobs]);
    };

    return(
    <div>
        <div style={{margin: '12px 0'}}>
            {cities.map((city) => {
                const isSelected = selectedCities.has(city);
                return (
                    <span
                        key={city}
                        onClick={() => {
                            setSelectedCities(prevSelectedCities => {
                                const set = new Set(prevSelectedCities);
                                if (set.has(city)) set.delete(city);
                                else set.add(city);
                                return set;
                            });
                        }}
                        style={{
                            display: 'inline-block',
                            padding: '6px 10px',
                            marginRight: 8,
                            marginBottom: 8,
                            borderRadius: 16,
                            border: isSelected ? '1px solid #0366d6' : '1px solid #ccc',
                            backgroundColor: isSelected ? '#0366d6' : '#fff',
                            color: isSelected ? '#fff' : '#111',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        {city}
                    </span>
                );
            })}
        </div>
        <div>Jobs By {skillName} Page</div>
        <button onClick={() => sortBySalary()}>Sort By Min Salary</button>
        {filteredJobs.map((job: any, index: number) => 
            <div key={index} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
                <h2>{job.title}</h2>
                <p>Company: {job.companyName}</p>
                <p>Skills: {job.requiredSkills.map((skill: any) => skill.name).join(', ')}</p>
                <p>B2B Salary: {job.salary_b2b?.from} - {job.salary_b2b?.to} PLN</p>
                <p>Permanent Salary: {job.salary_permanent?.from} - {job.salary_permanent?.to} PLN</p>
                <p>City: {job.city}</p>
                <a href={`https://justjoin.it/job-offer/${job.slug}`} target="_blank" rel="noopener noreferrer">https://justjoin.it/job-offer/{job.slug}</a>
            </div>
        )}

    </div>);
}

export default JobsBySkill;