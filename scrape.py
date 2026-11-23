import requests
from bs4 import BeautifulSoup
import time

# Known pages from St. Teresa's College website
URLS = [
    # Main pages
    "https://teresas.ac.in/",
    "https://teresas.ac.in/about-us/",
    "https://teresas.ac.in/vision-mission/",
    "https://teresas.ac.in/history/",

    # Academics
    "https://teresas.ac.in/admissions/",

    #Dept-Arts
    "https://teresas.ac.in/department-of-bharathnatyam/",
    "https://teresas.ac.in/department-of-communicative-english/",
    "https://teresas.ac.in/department-of-english/",
    "https://teresas.ac.in/department-of-economics/",
    "https://teresas.ac.in/department-of-french/",
    "https://teresas.ac.in/department-of-hindi/",
    "https://teresas.ac.in/department-of-history/",
    "https://teresas.ac.in/department-of-history/",
    "https://teresas.ac.in/department-of-malayalam/",
    "https://teresas.ac.in/department-of-sociology/",
    "https://teresas.ac.in/department-of-physical-education/",

    #Dept-Science
    "https://teresas.ac.in/departments/department-of-botany/",
    "https://teresas.ac.in/department-of-chemistry/",
    "https://teresas.ac.in/department-of-clinical-nutrition-and-dietetics/",
    "https://teresas.ac.in/department-of-computer-applications/",
    "https://teresas.ac.in/department-of-cyber-security-and-applied-computing/",
    "https://teresas.ac.in/department-of-fashion-designing/",
    "https://teresas.ac.in/department-of-home-science/",
    "https://teresas.ac.in/department-of-mathematics/",
    "https://teresas.ac.in/department-of-physics/",
    "https://teresas.ac.in/department-of-psychology/",
    "https://teresas.ac.in/department-of-zoology/",

    #Dept-MGT
    "https://teresas.ac.in/department-of-management-studies/",

    #Dept-Commerce
    "https://teresas.ac.in/department-of-commerce/",
    "https://teresas.ac.in/department-of-commerce-sf/",

    #Dept-Vocational
    "https://teresas.ac.in/department-food-processing-technology/",
    "https://teresas.ac.in/programs/department-of-bvoc-software-development/",
    "https://teresas.ac.in/b-voc-applied-media-studies/",

    #Professional-studies
    "https://teresas.ac.in/diploma-in-healthcare-assistance-2/",
    "https://teresas.ac.in/diploma-in-wellness-craft-baker/",
    "https://teresas.ac.in/diploma-in-professional-accounting-and-taxation/",
    "https://teresas.ac.in/diploma-in-business-administration/",
    "https://teresas.ac.in/diploma-in-digital-marketing/",
    "https://teresas.ac.in/diploma-in-garment-making-3/",
    "https://teresas.ac.in/interior-and-exterior-space-designing/",


    #open-course
    "https://teresas.ac.in/open-courses/",

    #UG Hons.
    "https://teresas.ac.in/wp-content/uploads/2025/05/FYUGP-Aided-courses.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/05/FYUGP-Self-financed-Courses-Revised.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/06/Vacancies_in_third_semester_FYUGP1-1.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/07/SOP-_studennts_opting_STC_from_other_colleges.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/06/SOP-_studennts_leaving_stc1.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/06/Final_Guidelines-_FYUGP_Major_Switching_Guidelines20251.pdf",


    #PROGRAMS

    ##BACHELOR OF ARTS

    "https://teresas.ac.in/programs/b-a-bharathnatyam/",
    "https://teresas.ac.in/programs/b-a-economics/",
    "https://teresas.ac.in/programs/b-a-english/",
    "https://teresas.ac.in/programs/b-a-english-literature-and-communication-studies/",
    "https://teresas.ac.in/programs/b-a-french/",
    "https://teresas.ac.in/programs/b-a-history/",
    "https://teresas.ac.in/programs/b-a-sociology/",
    "https://teresas.ac.in/programs/b-com-with-finance-and-taxation/",
    "https://teresas.ac.in/programs/bachelor-of-commerce-self-financing/",
    "https://teresas.ac.in/integrated-m-a-programme-in-social-sciences-economics-aided-programme/",

    ##BACHELOR OF SCIENCE
    "https://teresas.ac.in/programs/b-sc-apparel-and-fashion-design/",
    "https://teresas.ac.in/21645-2/",
    "https://teresas.ac.in/programs/b-sc-botany/",
    "https://teresas.ac.in/programs/b-sc-chemistry/",
    "https://teresas.ac.in/programs/b-sc-computer-applications-triple-main/",
    "https://teresas.ac.in/programs/b-sc-homescience/",
    "https://teresas.ac.in/programs/b-sc-mathematics/",
    "https://teresas.ac.in/programs/b-sc-physics/",
    "https://teresas.ac.in/programs/b-sc-zoology/",

    ##MGT-STUDIES
    "https://teresas.ac.in/20300-2/",
    "https://teresas.ac.in/pgdm-business-analytics/",

    ##BVOC
    "https://teresas.ac.in/programs/department-of-ugc-sponsored-b-voc-programmes/",
    "https://teresas.ac.in/programs/department-of-bvoc-software-development/",
    "https://teresas.ac.in/b-voc-applied-media-studies/",

    ##DIPLOMA PGMS (NSQF)
    "https://teresas.ac.in/diploma-in-healthcare-assistance-2/",
    "https://teresas.ac.in/diploma-in-wellness-craft-baker/",
    "https://teresas.ac.in/diploma-in-digital-marketing/",
    "https://teresas.ac.in/diploma-in-garment-making-3/",
    "https://teresas.ac.in/interior-and-exterior-space-designing/",

    ##MASTER OF ARTS
    "https://teresas.ac.in/programs/m-a-bharathanatyam/",
    "https://teresas.ac.in/programs/ma-economics/",
    "https://teresas.ac.in/programs/ma-english/",
    "https://teresas.ac.in/programs/mahistorysf/",
    "https://teresas.ac.in/m-a-journalism-and-mass-communication/",
    "https://teresas.ac.in/programs/ma-sociology/",
    "https://teresas.ac.in/programs/m-com/",
    "https://teresas.ac.in/programs/master-in-tourism-and-travel-management/",

    ##MASTER OF SCIENCE
    "https://teresas.ac.in/programs/m-sc-applied-statistics-and-data-analytics/",
    "https://teresas.ac.in/programs/m-sc-botany/",
    "https://teresas.ac.in/programs/m-sc-chemistry/",
    "https://teresas.ac.in/programs/m-sc-childdevelopment/",
    "https://teresas.ac.in/programs/masters-programme-in-clinical-nutrition-and-dietetics/",
    "https://teresas.ac.in/programs/m-sc-food-science-nutrition/",
    "https://teresas.ac.in/masters-in-fashion-designing/",
    "https://teresas.ac.in/msc-mathematics/",
    "https://teresas.ac.in/programs/msc-physics/",
    "https://teresas.ac.in/m-sc-psychology/",
    "https://teresas.ac.in/programs/msc-resource-management-and-interior-designing/",
    "https://teresas.ac.in/programs/msc-zoology-self-financing/",
    "https://teresas.ac.in/m-voc-food-processing-technology/",

    ## PG DIPLOMA
    "https://teresas.ac.in/department-of-management-studies/",
    "https://teresas.ac.in/programs/p-g-diploma-in-clinical-nutrition-dietetics/",
    "https://teresas.ac.in/programs/p-g-diploma-fashion-designing-apparel-merchandising/",

    ##TERESAIAN ADDITIONAL SKILL
    "https://teresas.ac.in/teresian-additional-skil-aquisition-courses-tasac/",


    # Facilities
    "https://teresas.ac.in/library/",
    "https://teresas.ac.in/hostel/",
    "https://teresas.ac.in/canteen/",
    "https://teresas.ac.in/facilities/",
    "https://teresas.ac.in/college-resource/e-learning-center/",
    "https://teresas.ac.in/college-resource/auditorium/",
    "https://teresas.ac.in/gymnasium/",
    "https://teresas.ac.in/language-lab/",


    #ABOUT US
    "https://teresas.ac.in/leading-ladies/",
    "https://teresas.ac.in/about-us/",
    "https://teresas.ac.in/advisory-board/",
    "https://teresas.ac.in/principals/",
    "https://teresas.ac.in/statutory-body/",
    "https://teresas.ac.in/wp-content/uploads/2025/10/Adminstrative_Organogram_final1.pdf",
    "https://teresas.ac.in/wp-content/uploads/2025/10/Academic_Organogram1.pdf",
    "https://teresas.ac.in/st-teresas-college-history/",
    "https://teresas.ac.in/accolades/",
    "https://teresas.ac.in/policies/",


    #RESEARCH
    "https://teresas.ac.in/teresian-students-research-and-mentoring-cell-tsrmc/",
    "https://teresas.irins.org/",


    #EXAMINATION
    "https://teresas.ac.in/notifications/",
    "https://teresas.ac.in/downloads/",
    "https://teresas.ac.in/revaluation-result/",
    "https://teresas.ac.in/orders-and-circulars-new/",


    #IQAC
    "https://teresas.ac.in/internal-quality-assurance-cell/",

    #NIRF
    "https://teresas.ac.in/internal-quality-assurance-cell/nirf/",

    #NAAC
    "https://teresas.ac.in/naac-certificates/",
    "https://teresas.ac.in/wp-content/uploads/2022/09/SSR-2019-1.pdf",
    "https://teresas.ac.in/wp-content/uploads/2022/08/IIQA.pdf",
    "https://teresas.ac.in/dvv-metric-wise-documents/",

    #TEE
    "https://teresas.ac.in/mhrd-institute-innovation-council-iic/",
    "https://teresas.ac.in/innovation-and-entrepreneurship-development-centres-iedc/",
    "https://teresas.ac.in/teresian-innovation-and-business-incubation-centre-2/",
    "https://teresas.ac.in/step-society-of-teresians-for-environment-protection/",
    "https://teresas.ac.in/entrepreneur-development-club/",
    "https://teresas.ac.in/the-innovation-gazette/",

    #KEY INITIATIVE
    "https://teresas.ac.in/teresian-centre-for-indian-knowledge-system-iks/",
    "https://teresas.ac.in/teresian-instrumentation-and-consultancy-centre-ticc/",
    "https://teresas.ac.in/centre-for-strategic-partnership-and-development/",
    "https://teresas.ac.in/teresian-media-centre/",
    "https://teresas.ac.in/radio-kochi-90-fm/",


    #STUDENTS
    "https://teresas.ac.in/gallery/",
    "https://teresas.ac.in/students-union/",
    "https://teresas.ac.in/students-welfare/",
    "https://teresas.ac.in/extracurricular-activities/",
    "https://teresas.ac.in/bhoomitra-sena/",
    "https://teresas.ac.in/teresian-innovation-and-incubation/",
    "https://teresas.ac.in/scholarships-3/",
    "https://teresas.ac.in/student-health-promotion/",
    "https://teresas.ac.in/national-cadet-corps-ncc/",
    "https://teresas.ac.in/national-service-scheme-nss/",
    "https://teresas.ac.in/civil-service-grooming-programme/",
    "https://teresas.ac.in/wp-content/uploads/2023/08/Student-code-of-conduct.pdf",
    "https://teresas.ac.in/wp-content/uploads/2023/03/Gender-Sensitization-Action-Plan-1.pdf",
    "https://teresas.ac.in/learning-and-teaching/",
    "https://teresas.ac.in/career-enhancement-and-development-schemes/",
    "https://teresas.ac.in/handbook-and-calendar/",

    ##CLUBS
    "https://teresas.ac.in/stc-consumer-club/",
    "https://teresas.ac.in/rural-entrepreneurship-development-cell-red-cell/",
    "https://teresas.ac.in/debate-club/",
    "https://teresas.ac.in/tourism-club/",
    "https://teresas.ac.in/drama-club/",
    "https://teresas.ac.in/quiz-club/",
    "https://teresas.ac.in/poets-club/",
    "https://teresas.ac.in/fine-arts-club/",
    "https://teresas.ac.in/library-club/",
    "https://teresas.ac.in/entrepreneur-development-club/",
    "https://teresas.ac.in/youth-red-cross-unit/",
    "https://teresas.ac.in/jesus-youth/",
    "https://teresas.ac.in/i-connect/",
    "https://teresas.ac.in/writers-forum/",



    #COMMITTIES & CELLS
    "https://teresas.ac.in/pta/",
    "https://teresas.ac.in/internal-complaints-committee-icc/",
    "https://teresas.ac.in/counselling-cell/",
    "https://teresas.ac.in/anti-raging-committee/",
    "https://teresas.ac.in/sc-st-minority-monitoring-cell/",
    "https://teresas.ac.in/grievence-redressal-committee/",
    "https://teresas.ac.in/planning-forum-and-electoral-literacy-cell/",
    "https://teresas.ac.in/disability-cell/",



    #LOGINS
    "http://eportal.teresas.ac.in/student/",
    "https://digna.teresas.ac.in/",
    "http://117.239.78.99/moodle/login/index.php",
    "http://asta.teresas.ac.in/",
    "https://mail.google.com/a/teresas.ac.in",
    "https://teresas.irins.org/login",
    "https://lms.teresas.ac.in/",


    # Contact
    "https://teresas.ac.in/contact-us/",
    "https://www.facebook.com/st.teresascollege/",
    "https://twitter.com/St_Teresas_",
    "https://www.instagram.com/st.teresascollege/",
    "https://www.youtube.com/@stteresascollege7682",
    "https://www.linkedin.com/company/st-teresas-college/",
    "https://in.pinterest.com/stteresascollege/",

]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

def clean_text(text: str) -> str:
    """Collapse extra whitespace and blank lines."""
    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]  # remove empty
    return "\n".join(lines)

def scrape_page(url: str) -> str:
    """Fetch one page and return its cleaned text."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()

        soup = BeautifulSoup(r.text, "html.parser")

        # Remove junk elements
        for tag in soup(["script", "style", "nav", "footer",
                         "header", "aside", "noscript", "iframe"]):
            tag.decompose()

        # Try to find main content first
        main = (
            soup.find("main")
            or soup.find("article")
            or soup.find("div", class_="content")
            or soup.body
        )

        if not main:
            return ""

        text = main.get_text(separator="\n", strip=True)
        return clean_text(text)

    except Exception as e:
        print(f"  ✗ {url}: {e}")
        return ""

def main():
    print("🔍 Scraping St. Teresa's College website...\n")

    all_content = []

    for url in URLS:
        print(f"→ {url}")
        text = scrape_page(url)

        if text:
            print(f"  ✓ {len(text)} chars extracted")
            all_content.append({
                "url": url,
                "text": text,
            })
        else:
            print(f"  ⚠ No content found")

        time.sleep(1)  # be polite to the server

    # Write everything to college_data.txt
    with open("college_data.txt", "w", encoding="utf-8") as f:
        f.write("ST. TERESA'S COLLEGE (AUTONOMOUS), KOCHI\n")
        f.write("Official website: https://teresas.ac.in\n")
        f.write("=" * 60 + "\n\n")

        for entry in all_content:
            f.write(f"\n\n=== SOURCE: {entry['url']} ===\n")
            f.write(entry["text"])
            f.write("\n")

    total_chars = sum(len(e["text"]) for e in all_content)
    print(f"\n✅ Done!")
    print(f"   Pages scraped: {len(all_content)}")
    print(f"   Total characters: {total_chars:,}")
    print(f"   Saved to: college_data.txt")

if __name__ == "__main__":
    main()