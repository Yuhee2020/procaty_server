interface ContactInfo {
  skype?: string;
  linkedin?: string;
  zoom?: string;
  phone?: string;
}

interface LanguageSkill {
  language: Language;
  level: LanguageLevel;
}

interface ConsultationPackage {
  id: string;
  title: string;
  subTitle?: string;
  shortDescription?: string;
  commissionRate: number;
  advantages: string[]; // what you'll learn
  products: Product[]; //[books, learning materials,... +] consultation
  coachersIds: string[];

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deleted: boolean;

  isPublished: boolean;
}

interface Product {
  title: string;
  subTitle?: string;
  description?: string;
  shortDescription?: string;
  // picture?: FileSource;
  price: number;
  productType: ProductType;
  // files?: FileSource[];

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deleted: boolean;
  isPublished: boolean;
}

interface Item {
  product: Product;
  quantity: number;
}

interface ConsultationOrder {
  id: string;
  consultationPackageId: string;
  coacherId: string;
  customerId: string;
  meetingTimeZone: string;
  meetingDatestamp: Date;
  items: Item[];
  totalPrice: number;
  commission: number;
  status: ConsultationOrderStatus;
  customerIssuesComment?: string;
}

enum ConsultationOrderStatus {
  OrderPlaced = 0,
  CardFreezed = 1,
  CoacherConfirmed = 2,
  CardCharged = 3,

  CardChargeFailed = -1,
  OrderCancelled = 501,
  OrderRefunded = 502,
  CustomerIssues = 503,
}

interface ArticleCategory {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
}

interface OneTimePurchase {
  id: string;
  customerId: string;
  items: Item[];
  totalPrice: number;
  status: OneTimePurchaseStatus;
}

enum OneTimePurchaseStatus {
  OrderPlaced = 0,
  CardCharged = 1,
  CardChargeFailed = -1,
  CustomerIssues = 500,
  OrderRefunded = 501,
}

//JOB:
//translation of what fields
//trimm, low-cased
