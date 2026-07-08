import AstroBotImg from '../assets/images/astrobot.png';
import OraAstrosferaImg from '../assets/images/arms/ora-astrosfera.png';
import OraMiniImg from '../assets/images/arms/ora-mini.png';
import OraGigaImg from '../assets/images/arms/ora-giga.png';
import NavIQImg from '../assets/images/point_control.gif';

// Import Videos
import Ar3CatchVideo from '../assets/video/ar3_catch.mp4';
import CVViewVideo from '../assets/video/ai_view_ar3_catch.mp4';
import HubbleCaptureVideo from '../assets/video/hubble_capture_compressed.mp4';
import InSpaceSegmentationVideo from '../assets/video/in_space_segmentation_compressed.mp4';
import SegmentationDemoVideo from '../assets/video/segmentation_demo2.mp4';

export const services = [
    {
        id: 'rpoc-service',
        title: "RPOC as a Service",
        category: "Service",
        availability: "Q4 2026",
        highlights: ["Closed-loop capture", "Arm + ASTRA-P + NavIQ", "Turnkey"],
        tagline: "Rendezvous, Proximity Operations, and Capture as a turnkey service.",
        description: "Rendezvous, Proximity Operations, and Capture (RPOC) service leveraging advanced computer vision and autonomous robotic manipulation. Powered by our robotic arms + ASTRA-P + NavIQ working as a closed-loop system.",
        videos: [Ar3CatchVideo, CVViewVideo],
        relatedProducts: [
            { id: 'robotic-arms', label: 'Robotic Arms', context: 'The arm that performs the capture.' },
            { id: 'astrap', label: 'ASTRA-P', context: 'Autonomous guidance and control of the approach and capture.' },
            { id: 'naviq', label: 'NavIQ', context: 'Computer vision for state estimation of the target.' }
        ]
    },
    {
        id: 'de-orbit-service',
        title: "De-Orbit as a Service",
        category: "Service",
        availability: "2028",
        highlights: ["Debris removal", "Controlled re-entry", "Sustainable orbits"],
        tagline: "End-of-life disposal for satellites and debris, keeping orbits sustainable.",
        description: "End-of-life disposal services for satellites and debris removal to ensure sustainable orbital operations. Built on the same robotic arms + ASTRA-P + NavIQ stack we use for RPOC.",
        video: HubbleCaptureVideo,
        relatedProducts: [
            { id: 'robotic-arms', label: 'Robotic Arms', context: 'The arm that performs the capture.' },
            { id: 'astrap', label: 'ASTRA-P', context: 'Autonomous guidance for capture and controlled re-entry.' },
            { id: 'naviq', label: 'NavIQ', context: 'Computer vision for non-cooperative target tracking.' }
        ]
    }
    /*
     * Deferred services, kept for later (not deleted). Re-enable when these
     * offerings are ready to be marketed publicly.
     *
    ,{
        id: 'satellite-upgrade',
        title: "Satellite Upgrade",
        category: "Service (Available 2028)",
        description: "Hardware upgrades and component replacement for operational satellites to extend mission life and capabilities.",
        image: ComingSoonImg
    },
    {
        id: 'refueling',
        title: "Refueling",
        category: "Service (Available 2028)",
        description: "On-orbit refueling services to extend the operational lifespan of maneuverable spacecraft.",
        image: ComingSoonImg
    },
    {
        id: 'orbital-maneuver',
        title: "Orbital Maneuver",
        category: "Service (Available 2028)",
        description: "Tugging and relocation services for orbit raising, inclination changes, and constellation phasing.",
        image: ComingSoonImg
    },
    {
        id: 'data-center-maintenance',
        title: "Data Center Maintenance",
        category: "Service (Available 2030)",
        description: "Autonomous maintenance and servicing for orbital data centers and compute infrastructure.",
        image: ComingSoonImg
    },
    {
        id: 'asset-protection',
        title: "Asset Protection",
        category: "Service (Available 2030)",
        description: "Security and monitoring services for high-value space assets against orbital threats.",
        image: ComingSoonImg
    }
    */
];

export const hardwareProducts = [
    {
        id: 'robotic-arms',
        title: "Robotic Arms",
        category: "Hardware",
        featured: true,
        highlights: ["7-DOF", "Radiation-tolerant", "Mission-customizable"],
        tagline: "Our 7-DOF flight arm family: ORA-Astrosfera (flagship), ORA-Mini, and ORA-Giga.",
        description: "Our robotic arms perform the physical work in orbit: capture, manipulation, and servicing. Paired with NavIQ for perception and ASTRA-P for autonomous guidance and control, they form a complete autonomous capture and servicing system.",
        image: OraAstrosferaImg,
        imageFit: "contain",
        imageBg: "bg-[#010101]",
        variants: [
            {
                name: "ORA-Astrosfera",
                badge: "Flagship",
                image: OraAstrosferaImg,
                description: "The 7-DOF flight arm. Radiation-tolerant and mission-customizable."
            },
            {
                name: "ORA-Mini",
                badge: "Compact",
                image: OraMiniImg,
                description: "Sized for CubeSat-class missions. Dual-arm configuration designed to fit a 27U CubeSat; single-arm configuration designed to fit a 24U CubeSat. Inherits the ORA-Astrosfera architecture and control software."
            },
            {
                name: "ORA-Giga",
                badge: "Heavy-lift",
                image: OraGigaImg,
                description: "Sized for large-structure assembly, station servicing, and high-mass capture operations. Inherits the ORA-Astrosfera architecture and control software."
            }
        ],
        relatedProducts: [
            { id: 'astrap', label: 'Powered by ASTRA-P', context: 'Autonomous guidance and control for the arm.' },
            { id: 'naviq', label: 'Sees with NavIQ', context: 'Real-time computer vision for unprepared RSOs.' },
            { id: 'satellite-os', label: 'Hosted on ORBtos', context: 'Run on any spacecraft bus via our flight OS.' }
        ]
    },
    {
        id: 'astrobot',
        title: "AstroBot",
        category: "Hardware",
        highlights: ["Free-flyer", "Autonomous docking", "On-orbit refueling"],
        tagline: "Autonomous free-flying refueling vehicle for satellites in orbit.",
        description: "AstroBot is our autonomous free-flying vehicle, purpose-built for in-space refueling of customer satellites. It rendezvouses with a target, docks, and transfers propellant, extending mission life without launching a replacement. Uses NavIQ for perception and ASTRA-P for autonomous guidance and control.",
        image: AstroBotImg,
        relatedProducts: [
            { id: 'naviq', label: 'Sees with NavIQ', context: 'Real-time perception of the target satellite.' },
            { id: 'astrap', label: 'Guided by ASTRA-P', context: 'Autonomous GNC for rendezvous and docking.' }
        ]
    }
];

export const softwareProducts = [
    {
        id: 'satellite-os',
        title: "ORBtos",
        category: "Software",
        highlights: ["Bus-agnostic", "Hosts NavIQ + ASTRA-P", "Modular"],
        tagline: "Our flight operating system. Hosts NavIQ and ASTRA-P natively on any spacecraft bus.",
        description: "ORBtos is our flight software platform. It runs NavIQ (perception) and ASTRA-P (autonomous guidance and control) as native modules, letting any spacecraft bus run the full Orbital Robotics autonomous stack with minimal integration.",
        console: true,
        relatedProducts: [
            { id: 'astrap', label: 'Hosts ASTRA-P', context: 'Autonomous GNC runs natively as an ORBtos module.' },
            { id: 'naviq', label: 'Hosts NavIQ', context: 'Computer vision runs natively as an ORBtos module.' }
        ],
        whyUs: [
            { title: "Modular by design", description: "Compose mission logic from reusable components instead of building a flight stack from scratch." },
            { title: "Stack-native", description: "Hosts our ASTRA-P and NavIQ modules out of the box." },
            { title: "Bus-agnostic", description: "Designed to run on any spacecraft bus with limited on-site integration." }
        ]
    },
    {
        id: 'naviq',
        title: "NavIQ",
        category: "Software",
        highlights: ["Stereo vision", "No CAD or markers", "Real-time state"],
        tagline: "Our computer vision software. Estimates the position and motion of any unprepared satellite or debris object from stereo vision alone.",
        description: "NavIQ is our perception layer. It generates real-time position, orientation, and velocity estimates of non-cooperative space objects, with no CAD models, fiducial markers, or prior imagery required. Feeds its state estimate into ASTRA-P for autonomous capture.",
        video: InSpaceSegmentationVideo,
        videoFit: "cover",
        videoPosition: "bottom",
        heroMedia: false,
        demos: [
            { video: InSpaceSegmentationVideo, videoPosition: "bottom", caption: "NavIQ segmenting an unprepared target in orbit." },
            { video: SegmentationDemoVideo, controls: true, caption: "Real-time segmentation of a non-cooperative target." }
        ],
        relatedProducts: [
            { id: 'astrap', label: 'Pairs with ASTRA-P', context: "NavIQ feeds state estimates into ASTRA-P's autonomous GNC for closed-loop RPOC." },
            { id: 'robotic-arms', label: 'Runs on ORA', context: "Hosted natively on the ORA arm family's integrated cameras, with no dedicated vision hardware required." },
            { id: 'satellite-os', label: 'Hosted on ORBtos', context: 'Runs as a module on ORBtos for spacecraft that need on-orbit perception.' }
        ],
    },
    {
        id: 'astrap',
        title: "ASTRA-P",
        category: "Software",
        highlights: ["Autonomous GNC", "Lyapunov-verified", "Monte Carlo tested"],
        tagline: "Our autonomous guidance and control software. Takes NavIQ's state estimate and plans the capture maneuver.",
        description: "ASTRA-P is our guidance and control layer. Given a state estimate from NavIQ, it plans and executes precise approach and capture maneuvers against unprepared satellites and debris. Stability is mathematically verified via Lyapunov analysis and validated across thousands of randomized Monte Carlo scenarios. Hosted natively on ORBtos.",
        image: NavIQImg,
        relatedProducts: [
            { id: 'naviq', label: 'Pairs with NavIQ', context: 'NavIQ provides closed-loop state estimation for the controller.' },
            { id: 'robotic-arms', label: 'Drives the arm family', context: 'ORA-native arm control for end-to-end autonomous manipulation.' },
            { id: 'satellite-os', label: 'Hosted on ORBtos', context: 'Runs as an ORBtos module on the host spacecraft.' }
        ]
    }
];
