const casesConfigs = [
  {
    id: 1,
    title: "Post-Stroke Rehab",
    focus: "Neurological",
    scenario: "A 68-year-old male is 3 weeks post left middle cerebral artery (MCA) ischemic stroke. He presents with right-sided hemiparesis (arm > leg) and mild expressive aphasia. He can stand with moderate assistance but struggles to transfer from bed to chair. His primary goal is to safely walk around his home.",
    question: "What is the most appropriate initial functional intervention for this patient?",
    options: [
      "Immediate high-intensity treadmill training",
      "Task-specific training focusing on sit-to-stand mechanics and weight-shifting",
      "Passive range of motion (PROM) exclusively for the right arm",
      "Prescription of a motorized wheelchair for home mobility"
    ],
    correctOptionIndex: 1,
    insight: {
      explanation: "Task-specific training (sit-to-stand, weight-shifting) is the golden standard for early functional mobility in stroke rehab. It promotes neuroplasticity for the most critical immediate daily tasks.",
      whyIncorrect: "High-intensity treadmill is premature given he needs moderate assistance to stand. PROM alone doesn't stimulate motor recovery. Wheelchair prescription immediately undermines the goal of walking.",
      principles: ["Neuroplasticity", "Task-Specific Practice", "Early functional mobilization"]
    },
    investigations: {
      labs: "Cholesterol: 240 mg/dL (High)\nBP: 145/90 mmHg\nGlucose: 110 mg/dL",
      imaging: {
        title: "Brain MRI (Axial T2)",
        type: "image",
        url: "./assets/brain_mri_scan_1776776070173.png"
      },
      functional: "Berg Balance Scale: 18/56 (High Fall Risk)\nFugl-Meyer Assessment (Upper Extremity): 22/66"
    }
  },
  {
    id: 2,
    title: "ACL Reconstruction",
    focus: "Orthopedic",
    scenario: "A 22-year-old female athlete is 2 days post-op from a right Anterior Cruciate Ligament (ACL) reconstruction using a patellar tendon autograft. She is non-weight-bearing on crutches per the surgeon, with a brace locked in full extension. She reports moderate pain (6/10).",
    question: "Which of the following interventions should be prioritized during this early post-operative phase?",
    options: [
      "Open Kinetic Chain (OKC) resisted knee extensions to prevent quad atrophy",
      "Aggressive passive knee flexion beyond 90 degrees to restore ROM",
      "Restoration of full passive knee extension and quadriceps activation (e.g., quad sets)",
      "Plyometric jumping on the uninjured leg"
    ],
    correctOptionIndex: 2,
    insight: {
      explanation: "Restoring full passive extension and achieving voluntary quad activation (superior patellar glide) is critical early on to prevent arthrofibrosis and establish normal gait mechanics later.",
      whyIncorrect: "OKC extensions place high shear stress on the new graft. Aggressive flexion can strain the joint and graft; it's typically limited early on. Plyometrics are inappropriate and risky so early.",
      principles: ["Protection of healing tissue", "Early ROM (Extension)", "Neuromuscular control"]
    },
    investigations: {
      labs: "WBC: 8,500/mcL (Normal)\nCRP: Mildly elevated (expected post-op)",
      imaging: {
        title: "Knee Radiograph (AP)",
        type: "image",
        url: "./assets/knee_xray_scan_1776775835738.png"
      },
      functional: "Active Knee Extension: -10 degrees lag\nKnee Flexion: 45 degrees\nQuad strength: 2/5 (trace contraction)"
    }
  },
  {
    id: 3,
    title: "Chronic Low Back Pain",
    focus: "Chronic Pain",
    scenario: "A 45-year-old office worker presents with a 2-year history of diffuse, intermittent axial low back pain. There is no radiation, no numbness, and no red flags (bowel/bladder intact). She fears movement (kinesiophobia) and avoids bending forward, believing her spine is 'damaged'.",
    question: "What is the most evidence-based rehabilitation approach for this patient?",
    options: [
      "Strict bed rest and use of a lumbar corset",
      "Pain Neuroscience Education (PNE) combined with graded exposure to movement",
      "Immediate high-velocity manipulation of the lumbar spine",
      "Traction therapy to decompress the intervertebral discs"
    ],
    correctOptionIndex: 1,
    insight: {
      explanation: "For chronic non-specific low back pain driven by fear-avoidance, combining Pain Neuroscience Education with graded exposure slowly de-threatens movement and builds self-efficacy.",
      whyIncorrect: "Bed rest exacerbates chronic pain and deconditioning. Manipulation might provide short-term relief but doesn't address the kinesiophobia. Traction lacks strong evidence for axial LBP.",
      principles: ["Biopsychosocial Model", "Graded Exposure", "De-threatening movement"]
    },
    investigations: {
      labs: "ESR: 12 mm/hr (Normal)\nRheumatoid Factor: Negative",
      imaging: {
        title: "Lumbar MRI (Sagittal T2)",
        type: "image",
        url: "./assets/lumbar_mri_scan_1776775851013.png"
      },
      functional: "Oswestry Disability Index: 42% (Severe disability)\nLumbar Flexion: Limited by fear, not structure."
    }
  },
  {
    id: 4,
    title: "Total Knee Arthroplasty",
    focus: "Post-Surgical",
    scenario: "A 72-year-old male is 4 weeks post right Total Knee Arthroplasty (TKA). His incision is fully healed. He walks with a single point cane but complains that his right knee feels 'stiff' and 'heavy'. Active knee ROM is 5-90 degrees.",
    question: "What is the most appropriate focus for physical therapy at this stage?",
    options: [
      "Maximal resistance strength training the hamstring muscles",
      "Focusing heavily on knee proprioception via balance boards only",
      "Aggressive joint mobilizations and prolonged stretching to maximize knee flexion and extension",
      "Issuing a wheelchair to rest the joint completely"
    ],
    correctOptionIndex: 2,
    insight: {
      explanation: "At 4 weeks, achieving terminal extension (0 deg) and functional flexion (>100 deg) is paramount before scar tissue solidifies. Joint mobs and prolonged stretches are necessary.",
      whyIncorrect: "Hamstring training is secondary to ROM and Quad strength. Proprioception alone won't fix the gross ROM deficits. Resting causes contractures.",
      principles: ["Tissue remodeling", "Joint mechanics", "Functional ROM needs (110 deg for stairs)"]
    },
    investigations: {
      labs: "D-Dimer: Negative (ruling out DVT)\nPT/INR: Therapeutic range",
      imaging: {
        title: "Post-Op Knee X-Ray",
        type: "text",
        text: "Well-seated components of right Total Knee Arthroplasty. No radiolucent lines indicating loosening. Good alignment."
      },
      functional: "TUG test: 18 seconds (Elevated fall risk)\nROM: 5 to 90 degrees."
    }
  },
  {
    id: 5,
    title: "Incomplete Spinal Cord Injury",
    focus: "Neurological",
    scenario: "A 30-year-old female sustained a T12 incomplete spinal cord injury (ASIA D) 6 months ago. She has good core control and 4/5 strength in her hip flexors and quads, but notable weakness in dorsiflexion (2/5). She wants to walk without her walker.",
    question: "Which intervention will best facilitate her transition to independent community ambulation?",
    options: [
      "Prescription of Ankle-Foot Orthoses (AFOs) to address foot drop during the swing phase",
      "Botox injections to her calf muscles",
      "Strict core stabilization exercises in a supine position",
      "Discharging her from therapy since 6 months have passed"
    ],
    correctOptionIndex: 0,
    insight: {
      explanation: "With 4/5 proximal strength but 2/5 dorsiflexion, foot drop will severely compromise gait efficiency and safety. AFOs compensate for this weakness, enabling normalized gait kinematics.",
      whyIncorrect: "Botox is for spasticity, not flaccid weakness. Supine exercises don't translate to standing mechanics. Neurological recovery and optimization can continue well beyond 6 months.",
      principles: ["Orthotic compensation", "Energy conservation in gait", "Task-specific gait training"]
    },
    investigations: {
      labs: "Urinalysis: Trace leukocytes (Monitor for UTI)\nVitamin D: 32 ng/mL (Normal)",
      imaging: {
        title: "Spine MRI",
        type: "text",
        text: "Stable fusion T11-L1. Myelomalacia noted at T12 level consistent with prior trauma. No active cord compression."
      },
      functional: "10-Meter Walk Test: 0.6 m/s (Household ambulator speed)\nManual Muscle Test: Tibialis Anterior 2/5 bilaterally."
    }
  }
];
