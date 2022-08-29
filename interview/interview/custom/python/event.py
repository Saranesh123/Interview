import frappe
@frappe.whitelist()
def update_ji(subject,event,date,job,round):
    data = frappe.get_doc("Job Interview",job)
    for row in data.rounds:
        if row.rounds == round:
            row.subject = subject
            row.scheduled_date = date
            row.event = event
        data.save()
        
def validate(self,action):
    if not self.event_participants and self.job_interview_name:
        frappe.throw("Event Participants should not be empty")