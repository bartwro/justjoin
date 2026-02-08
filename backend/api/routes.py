from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/api")
cache = []

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.get("/jobsByCity")
def jobsByCity():
    jobs = get_jobs()
    cities = {}

    for job in jobs:
        city = job['city']
        cities[city] = cities.get(city, 0) + 1
    
    return cities


# skill to counter map
@router.get("/skills")
def most_popular():
    skill_to_count_map = {}
    #skills = []
    print("Fetching jobs to calculate skills...")

    jobs = get_jobs()
    # skills.extend(skill['name'] for job in jobs for skill in job['requiredSkills']);
    skills = [skill['name'] for job in jobs for skill in job['requiredSkills']]

    print(f"Total skills fetched: {len(skills)}")

    # skill_to_count_map[2] = 2
    #print(skill_to_count_map.get(1))
    print(skills[0])
    print(skills[1])    

    for skill in skills:
        skill_to_count_map[skill] = skill_to_count_map.get(skill, 0) + 1
    
    skill_to_count_map['all'] = len(jobs)
    
    print(skill_to_count_map.get('C#'))

    sorted_skill_to_count_map = sorted(skill_to_count_map.items(), key=lambda item: item[1], reverse=True)

    return sorted_skill_to_count_map

# jobs by skill
@router.get("/jobs/{skill_name:path}")
def jobs_by_skill(skill_name: str):
    print(f"Fetching jobs for skill: {skill_name}...")
    jobs = get_jobs()
    filtered_jobs = [
        {'companyName': job['companyName'],
         'title': job['title'], 
         'requiredSkills': job['requiredSkills'], 
         'slug': job['slug'],
         'salary_b2b': get_salary(job, 'b2b'),
         'salary_permanent': get_salary(job, 'permanent'),
         'city': job['city']
         } 
        for job in jobs if skill_name.lower()=='all' or any(skill['name'].lower() == skill_name.lower() for skill in job['requiredSkills']) 
    ]
    print(f"Total jobs found for skill {skill_name}: {len(filtered_jobs)}")
    return filtered_jobs

def get_salary(job, type):
    return next((et for et in job['employmentTypes'] if et['currency'].lower() == 'pln' and et['type'].lower() == type), None)

def get_jobs():

    if cache:
        print("Returning cached jobs")
        return cache

    fromX = 0
    countX = 100
    result = []

    while fromX is not None and countX > 0:
        url = f"https://justjoin.it/api/candidate-api/offers?from={fromX}&itemsCount={countX}&categories=net&cityRadius=30&currency=pln&orderBy=descending&sortBy=publishedAt&keywordType=any&isPromoted=true"
        try:
            response = httpx.get(url)
            jobs = response.json()['data']
            meta = response.json()['meta']
            
            result.extend(jobs)
        
            fromX = meta['next']['cursor']
            countX = meta['next']['itemsCount']
        except Exception as e:
            print(f"Error fetching jobs: {e}")
            fromX = None

    # cache = result -- this would create a new local variable!!
    cache.extend(result)

    return result