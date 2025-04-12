from django.contrib import admin
from .models import MainContentItem

@admin.register(MainContentItem)
class MainContentItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'order', 'created_at', 'updated_at')
    list_filter = ('content_type',)
    search_fields = ('title', 'content')
    list_editable = ('order',)
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'content_type', 'read_more_link', 'order')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('created_at', 'updated_at')