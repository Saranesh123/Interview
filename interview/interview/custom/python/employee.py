import frappe
def get_emp_name(self,action):
    job_offer_doc = frappe.get_doc("Job Offer",self.job_offer_name)
    job_offer_doc.employee_name = self.name
    job_offer_doc.employee_joining_date = self.date_of_joining
    job_offer_doc.save()