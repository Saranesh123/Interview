import frappe
@frappe.whitelist()
def get_job_offer_name(job,job_interview):
    doc = frappe.get_doc("Job Interview",job_interview)
    doc.job_offer_name = job
    doc.save()
    
def validate(self,action):
    hr_user_list = frappe.db.sql(""" select tu.email from `tabHas Role` thr inner join `tabUser` tu 
                                 on thr.parent = tu.name where thr.role = %s """,("HR User"))
    if self.owner not in hr_user_list and self.owner != "Administrator":
        frappe.throw("You are not allowed to create a Job Offer")
        
@frappe.whitelist()
def edit_job_offer_term(value,offer_term,doc_name):
    frappe.db.sql(""" update `tabJob Offer Term`tjot set tjot.value = %s where tjot.parent = %s 
                  and tjot.offer_term = %s """,(value,doc_name,offer_term))
    doc = frappe.get_doc("Job Offer",doc_name)
    doc.workflow_state = "Pending"
    doc.save()
    
@frappe.whitelist()
def create_employee(fname,gender,dob,doj,doc_name):
    new_emp_doc = frappe.new_doc("Employee")
    new_emp_doc.first_name = fname
    new_emp_doc.gender = gender
    new_emp_doc.date_of_birth = dob
    new_emp_doc.date_of_joining = doj
    new_emp_doc.job_offer_name = doc_name
    new_emp_doc.save()
    
@frappe.whitelist()
def salary_structure_assignment(doj,emp_name,sal):
    new_doc = frappe.new_doc("Salary Structure Assignment")
    new_doc.employee = emp_name
    new_doc.salary_structure = sal
    new_doc.from_date = doj
    new_doc.save()
    new_doc.submit()
    
@frappe.whitelist()
def leave_policy_assignment(leave_policy,effective_from,effective_to,emp_name):
    new_doc = frappe.new_doc("Leave Policy Assignment")
    new_doc.employee = emp_name
    new_doc.leave_policy = leave_policy
    new_doc.effective_from = effective_from
    new_doc.effective_to = effective_to
    new_doc.save()
    new_doc.submit()