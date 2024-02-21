from django import forms

class NewMessageForm(forms.Form):
    recipient = forms.CharField(required=True)
    title = forms.CharField(required=True)
    text = forms.CharField(required=True)
    files = forms.FileField(required=False)