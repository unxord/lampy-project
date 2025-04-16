from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import CommonContentItem

@admin.register(CommonContentItem)
class CommonContentItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'page', 'get_display_author', 'created_at', 'updated_at')
    list_filter = ('page', 'author')
    search_fields = ('title', 'content', 'page', 'author__username', 'author_pseudonym')

    fieldsets = (
        (None, {
            'fields': ('page', 'title', 'content', 'read_more_link')
        }),
        (_('Авторство'), {
            'fields': ('author', 'author_pseudonym'),
        }),
        (_('Даты'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description=_('Автор'))
    def get_display_author(self, obj):
        if obj.author_pseudonym:
            return obj.author_pseudonym
        elif obj.author:
            return obj.author.get_username()
        return _("Не указан")