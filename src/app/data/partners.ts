/**
 * Sourcing partner types, labels and mock data.
 * Extracted from Sourcing.tsx for reusability and cleaner architecture.
 */

export type PartnerType = "all" | "manufacturer" | "fabric_supplier" | "trim_supplier" | "dye_house";
export type Region = "all" | "asia" | "europe" | "americas";
export type Certification = "GOTS" | "OEKO-TEX" | "BSCI" | "ISO 9001" | "GRS" | "Fair Trade";

export interface Partner {
    id: string;
    name: string;
    type: Exclude<PartnerType, "all">;
    region: Exclude<Region, "all">;
    country: string;
    city: string;
    image: string;
    rating: number;
    reviews: number;
    moq: string;
    leadTime: string;
    specialties: string[];
    certifications: Certification[];
    verified: boolean;
    sustainable: boolean;
    contactEmail: string;
    description: string;
    activeProjects: number;
    capacity: number; // 0–100
    reliability: number; // 0–100
}

export const typeLabels: Record<PartnerType, string> = {
    all: "All Partners",
    manufacturer: "Manufacturers",
    fabric_supplier: "Fabric Suppliers",
    trim_supplier: "Trim Suppliers",
    dye_house: "Dye Houses",
};

export const regionLabels: Record<Region, string> = {
    all: "All Regions",
    asia: "Asia Pacific",
    europe: "Europe",
    americas: "Americas",
};

export const mockPartners: Partner[] = [
    {
        id: "p-1",
        name: "Donghua Textile Group",
        type: "manufacturer",
        region: "asia",
        country: "China",
        city: "Guangzhou",
        image: "https://images.unsplash.com/photo-1758269664127-1f744a56e06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzcyMjQzMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 124,
        moq: "500 pcs",
        leadTime: "4–6 weeks",
        specialties: ["Woven blazers", "Tailored suiting", "Outerwear"],
        certifications: ["BSCI", "ISO 9001", "OEKO-TEX"],
        verified: true,
        sustainable: false,
        contactEmail: "sourcing@donghua-textile.cn",
        description: "Full-service CMT manufacturer specializing in structured garments with 20+ years of experience supplying European and American brands.",
        activeProjects: 3,
        capacity: 72,
        reliability: 96,
    },
    {
        id: "p-2",
        name: "Tessitura Monti",
        type: "fabric_supplier",
        region: "europe",
        country: "Italy",
        city: "Como",
        image: "https://images.unsplash.com/photo-1718117075248-3d3c3cd65264?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjB0ZXh0aWxlJTIwd2FyZWhvdXNlfGVufDF8fHx8MTc3MjMxNDk4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.9,
        reviews: 87,
        moq: "50 meters",
        leadTime: "2–3 weeks",
        specialties: ["Shirting fabrics", "Cotton blends", "Linen"],
        certifications: ["GOTS", "OEKO-TEX", "GRS"],
        verified: true,
        sustainable: true,
        contactEmail: "orders@tessituramonti.it",
        description: "Premium Italian fabric mill producing fine shirting and suiting fabrics since 1911. Known for sustainable practices and innovative weaving techniques.",
        activeProjects: 2,
        capacity: 58,
        reliability: 99,
    },
    {
        id: "p-3",
        name: "Saigon Stitch Co.",
        type: "manufacturer",
        region: "asia",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        image: "https://images.unsplash.com/photo-1768745888568-b3ef7c7ba366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwc2V3aW5nJTIwcHJvZHVjdGlvbiUyMGxpbmV8ZW58MXx8fHwxNzcyMzE0OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 63,
        moq: "300 pcs",
        leadTime: "3–5 weeks",
        specialties: ["Jersey knits", "Casual wear", "T-shirts"],
        certifications: ["BSCI", "Fair Trade"],
        verified: true,
        sustainable: true,
        contactEmail: "hello@saigonstitch.vn",
        description: "Vertically integrated knit manufacturer with in-house dyeing and finishing. Strong focus on ethical labor practices and fair wages.",
        activeProjects: 1,
        capacity: 45,
        reliability: 91,
    },
    {
        id: "p-4",
        name: "Nordic Knit Mills",
        type: "manufacturer",
        region: "europe",
        country: "Portugal",
        city: "Porto",
        image: "https://images.unsplash.com/photo-1746737198844-b9c9f4189352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG1pbGwlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MjMxNDk4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 41,
        moq: "200 pcs",
        leadTime: "3–4 weeks",
        specialties: ["Knitwear", "Merino wool", "Sweaters"],
        certifications: ["GOTS", "OEKO-TEX", "ISO 9001"],
        verified: true,
        sustainable: true,
        contactEmail: "production@nordicknit.pt",
        description: "Boutique knitwear mill producing premium quality sweaters and knitwear for contemporary fashion brands. Small batch friendly.",
        activeProjects: 2,
        capacity: 35,
        reliability: 94,
    },
    {
        id: "p-5",
        name: "Isko Denim",
        type: "fabric_supplier",
        region: "europe",
        country: "Turkey",
        city: "Istanbul",
        image: "https://images.unsplash.com/photo-1582481455314-5fd9fecd06b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGZhYnJpYyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzcyMzE0OTgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        reviews: 156,
        moq: "100 meters",
        leadTime: "2–4 weeks",
        specialties: ["Denim", "Stretch fabrics", "Selvedge"],
        certifications: ["GRS", "OEKO-TEX"],
        verified: true,
        sustainable: false,
        contactEmail: "wholesale@iskodenim.com",
        description: "World-leading denim fabric supplier offering a wide range of innovative denim constructions, from raw selvedge to performance stretch.",
        activeProjects: 0,
        capacity: 82,
        reliability: 88,
    },
    {
        id: "p-6",
        name: "Curtidos León",
        type: "trim_supplier",
        region: "americas",
        country: "Mexico",
        city: "León",
        image: "https://images.unsplash.com/photo-1764391791965-e57ac12cbb80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd29ya3Nob3AlMjBjcmFmdHNtYW5zaGlwfGVufDF8fHx8MTc3MjMxNDk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.4,
        reviews: 29,
        moq: "By project",
        leadTime: "1–2 weeks",
        specialties: ["Leather trims", "Metal hardware", "Buttons & zippers"],
        certifications: ["ISO 9001"],
        verified: false,
        sustainable: false,
        contactEmail: "ventas@curtidosleon.mx",
        description: "Artisanal trim and hardware supplier specializing in premium leather labels, custom metal snaps, and zipper sourcing for luxury brands.",
        activeProjects: 1,
        capacity: 60,
        reliability: 85,
    },
];
