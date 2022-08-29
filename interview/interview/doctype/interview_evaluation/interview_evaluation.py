# Copyright (c) 2022, admin and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class InterviewEvaluation(Document):
    def validate(self):
        for data in self.evaluation:
            if not data.rating:
                frappe.throw("Rating for the Evaluation Criteria should not be empty")

    def on_update(self):
        job_interview = frappe.get_doc("Job Interview",self.job_interview_name)
        job_interview.status = self.workflow_state
        job_interview.interview_evaluation_round = self.round
        job_interview.save()

@frappe.whitelist()
def criteria():
    return frappe.db.sql(""" select name criteria from `tabJob Evaluation Criteria` """,as_dict=1)
    
@frappe.whitelist()
def get_emp_filter(doctype,txt,searchfield,start,page_len,filters):
    return(set(frappe.db.sql(""" select tep.reference_docname from `tabEvent Participants` tep inner join `tabEvent` te 
                             on tep.parent = te.name where te.job_interview_name = %s """,filters['job_interview'],)))