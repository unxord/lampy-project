from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone

class CommonContentItem(models.Model):
    class PageType(models.TextChoices):
        HOME = 'home', _('Главная (Home)')
        ABOUT = 'about', _('О нас (About)')
        CONTACT = 'contact', _('Контакты (Contact)')

    page = models.CharField(
        _("Страница"),
        max_length=20,
        choices=PageType.choices,
        default=PageType.HOME,
        db_index=True,
        help_text=_("Страница, на которой будет отображаться этот контент.")
    )
    title = models.CharField(
        _("Заголовок"),
        max_length=255
    )
    content = models.TextField(
        _("Содержимое")
    )
    read_more_link = models.URLField(
        _("Ссылка 'Читать далее'"),
        blank=True,
        null=True
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Автор (Пользователь)"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='common_content_items'
    )
    author_pseudonym = models.CharField(
        _("Псевдоним автора (переопределение)"),
        max_length=150,
        blank=True,
        null=True,
        help_text=_("Если указано, будет отображаться вместо имени пользователя.")
    )
    created_at = models.DateTimeField(
        _("Дата создания"),
        default=timezone.now
    )
    updated_at = models.DateTimeField(
        _("Дата обновления"),
        default=timezone.now
    )

    class Meta:
        verbose_name = _("Элемент общего контента")
        verbose_name_plural = _("Элементы общего контента")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_page_display()}: {self.title}"

    def save(self, *args, **kwargs):
        if not self.pk:
            pass
        else:
             self.updated_at = timezone.now()
        super().save(*args, **kwargs)