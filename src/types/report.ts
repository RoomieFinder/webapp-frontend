export interface Report {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  ReporterUserID: number;
  ReportedUserID: number;
  TargetType: string;
  TargetID: number;
  Reason: string;
  Status: string;
  AdminID: number | null;
}