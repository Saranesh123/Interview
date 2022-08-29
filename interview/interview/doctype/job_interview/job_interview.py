# Copyright (c) 2022, admin and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class JobInterview(Document):
    def validate(self):
        if self._action == 'submit':
            for data in self.rounds:
                if not data.event:
                    frappe.throw("Create the event to submit this document")

@frappe.whitelist()
def create_interview_evaluation(name):
    existing_doc = frappe.db.sql(""" select tie.name from `tabInterview Evaluation` tie where tie.job_interview_name = %s """,name)
    doc = frappe.get_doc("Job Interview",name)
    interview_evaluation = frappe.new_doc("Interview Evaluation")
    interview_evaluation.job_applicant = doc.job_applicant
    interview_evaluation.applicant_name = doc.applicant_name
    interview_evaluation.gender = doc.gender
    interview_evaluation.position_applied = doc.position_applied
    interview_evaluation.designation = doc.designation
    interview_evaluation.department = doc.department
    interview_evaluation.job_interview_name = doc.name
    if existing_doc:
        interview_evaluation.round = len(existing_doc) + 1
    else:
        interview_evaluation.round = 1
    return interview_evaluation.as_dict()

@frappe.whitelist()
def validate_job_applicant(job,name):
    if frappe.db.sql(""" select tji.name from `tabJob Interview` tji where tji.job_applicant = %s """,job):
        frappe.throw(_("Job Interview for {0} already exists").format(name))
        
@frappe.whitelist()
def create_event(sub,name):
    doc = frappe.new_doc("Event")
    doc.subject = name + "-" + sub
    doc.job_interview_name = name
    doc.round = sub
    return doc.as_dict()

@frappe.whitelist()
def create_job_offer(job,app_name,desig,job_interview):
    doc = frappe.new_doc("Job Offer")
    doc.job_applicant = job
    doc.applicant_name = app_name
    doc.applicant_email = job
    doc.designation = desig
    doc.job_interview_name = job_interview
    return doc.as_dict()