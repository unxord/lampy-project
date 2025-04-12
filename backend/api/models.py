from django.db import models
from django.utils.translation import gettext_lazy as _

class MainContentItem(models.Model):
    class ContentType(models.TextChoices):
        INFORMATION = 'INFO', _('Информация')
        ANNOUNCEMENT = 'ANNOUNCE', _('Объявление')
        NEWS = 'NEWS', _('Новость')
    title = models.CharField(
        _("Заголовок"),
        max_length=200
    )
    content = models.TextField(
        _("Содержимое")
    )
    content_type = models.CharField(
        _("Тип контента"),
        max_length=10,
        choices=ContentType.choices,
        default=ContentType.INFORMATION,
        db_index=True
    )
    read_more_link = models.URLField(
        _("Ссылка 'Читать далее'"),
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(
        _("Порядок отображения"),
        default=0,
        help_text=_("Чем меньше число, тем выше элемент в списке своего типа.")
    )
    created_at = models.DateTimeField(
        _("Дата создания"),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _("Дата обновления"),
        auto_now=True
    )
    class Meta:
        verbose_name = _("Элемент контента главной страницы")
        verbose_name_plural = _("Элементы контента главной страницы")
        ordering = ['content_type', 'order', '-created_at']

    def __str__(self):
        return f"{self.get_content_type_display()}: {self.title}"